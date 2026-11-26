-- Aurum POS schema for the cloud install (Supabase Postgres). Mirrors schema.sql + inventory tables.
-- Times are stored as India local time (timestamp without time zone, session time zone Asia/Kolkata).

CREATE TABLE IF NOT EXISTS branches (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  address VARCHAR(255) NOT NULL DEFAULT '',
  phone VARCHAR(30) NOT NULL DEFAULT '',
  gstin VARCHAR(20) NOT NULL DEFAULT '',
  fssai VARCHAR(20) NOT NULL DEFAULT '',
  gst_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  bill_footer VARCHAR(255) NOT NULL DEFAULT 'Thank you! Visit again',
  daily_target NUMERIC(10,2) NOT NULL DEFAULT 40000,
  active SMALLINT NOT NULL DEFAULT 1,
  inv_auto_off SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS staff (
  id SERIAL PRIMARY KEY,
  branch_id INT NULL REFERENCES branches(id),
  name VARCHAR(80) NOT NULL,
  role VARCHAR(10) NOT NULL CHECK (role IN ('OWNER','MANAGER','CASHIER','KITCHEN')),
  pin_hash CHAR(64) NOT NULL,
  active SMALLINT NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL UNIQUE,
  color VARCHAR(9) NOT NULL DEFAULT '#2a78d6',
  station VARCHAR(40) NOT NULL DEFAULT 'Main Kitchen',
  sort INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL REFERENCES categories(id),
  code VARCHAR(12) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  is_veg SMALLINT NOT NULL DEFAULT 1,
  is_best SMALLINT NOT NULL DEFAULT 0,
  image VARCHAR(255) NULL,
  active SMALLINT NOT NULL DEFAULT 1,
  sort INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS branch_items (
  branch_id INT NOT NULL REFERENCES branches(id),
  item_id INT NOT NULL REFERENCES items(id),
  available SMALLINT NOT NULL DEFAULT 1,
  on_menu SMALLINT NOT NULL DEFAULT 1,
  price_override NUMERIC(10,2) NULL,
  auto_off SMALLINT NOT NULL DEFAULT 0,
  PRIMARY KEY (branch_id, item_id)
);

CREATE TABLE IF NOT EXISTS dining_tables (
  id SERIAL PRIMARY KEY,
  branch_id INT NOT NULL REFERENCES branches(id),
  label VARCHAR(10) NOT NULL,
  zone VARCHAR(30) NOT NULL DEFAULT 'Main',
  sort INT NOT NULL DEFAULT 0,
  UNIQUE (branch_id, label)
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  branch_id INT NOT NULL REFERENCES branches(id),
  order_type VARCHAR(10) NOT NULL CHECK (order_type IN ('DINE_IN','PICK_UP','SWIGGY','ZOMATO')),
  table_id INT NULL REFERENCES dining_tables(id),
  status VARCHAR(10) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN','BILLED','CANCELLED')),
  pax INT NOT NULL DEFAULT 1,
  customer_name VARCHAR(80) NULL,
  customer_phone VARCHAR(15) NULL,
  note VARCHAR(255) NULL,
  printed SMALLINT NOT NULL DEFAULT 0,
  created_by INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP,
  closed_at TIMESTAMP NULL,
  ext_ref VARCHAR(24) NULL
);
CREATE INDEX IF NOT EXISTS orders_branch_status ON orders (branch_id, status);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id),
  item_id INT NOT NULL REFERENCES items(id),
  name VARCHAR(100) NOT NULL,
  category VARCHAR(60) NOT NULL,
  station VARCHAR(40) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  qty INT NOT NULL,
  note VARCHAR(120) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP
);
CREATE INDEX IF NOT EXISTS order_items_order ON order_items (order_id);

CREATE TABLE IF NOT EXISTS kots (
  id SERIAL PRIMARY KEY,
  branch_id INT NOT NULL,
  order_id INT NOT NULL REFERENCES orders(id),
  kot_no INT NOT NULL,
  station VARCHAR(40) NOT NULL,
  label VARCHAR(30) NOT NULL,
  note VARCHAR(255) NULL,
  status VARCHAR(10) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','READY')),
  created_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP,
  ready_at TIMESTAMP NULL
);
CREATE INDEX IF NOT EXISTS kots_branch_status ON kots (branch_id, status);

CREATE TABLE IF NOT EXISTS kot_items (
  id SERIAL PRIMARY KEY,
  kot_id INT NOT NULL REFERENCES kots(id),
  name VARCHAR(100) NOT NULL,
  qty INT NOT NULL,
  note VARCHAR(120) NULL
);
CREATE INDEX IF NOT EXISTS kot_items_kot ON kot_items (kot_id);

CREATE TABLE IF NOT EXISTS bills (
  id SERIAL PRIMARY KEY,
  branch_id INT NOT NULL,
  order_id INT NOT NULL UNIQUE REFERENCES orders(id),
  bill_no VARCHAR(30) NOT NULL UNIQUE,
  seq INT NOT NULL,
  fy VARCHAR(5) NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  discount_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
  discount NUMERIC(10,2) NOT NULL DEFAULT 0,
  cgst NUMERIC(10,2) NOT NULL,
  sgst NUMERIC(10,2) NOT NULL,
  round_off NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  pay_mode VARCHAR(10) NOT NULL CHECK (pay_mode IN ('CASH','UPI','CARD','SPLIT','DUE','SWIGGY','ZOMATO')),
  cash_amt NUMERIC(10,2) NOT NULL DEFAULT 0,
  upi_amt NUMERIC(10,2) NOT NULL DEFAULT 0,
  card_amt NUMERIC(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(10) NOT NULL CHECK (status IN ('PAID','DUE','CANCELLED')),
  cancel_reason VARCHAR(255) NULL,
  cashier_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP
);
CREATE INDEX IF NOT EXISTS bills_branch_created ON bills (branch_id, created_at);

CREATE TABLE IF NOT EXISTS counters (
  branch_id INT NOT NULL,
  name VARCHAR(20) NOT NULL,
  period VARCHAR(10) NOT NULL,
  value INT NOT NULL DEFAULT 0,
  PRIMARY KEY (branch_id, name, period)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  branch_id INT NULL,
  staff_id INT NULL,
  action VARCHAR(40) NOT NULL,
  detail TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP
);
CREATE INDEX IF NOT EXISTS audit_branch_created ON audit_logs (branch_id, created_at);

CREATE TABLE IF NOT EXISTS ingredients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  unit VARCHAR(3) NOT NULL CHECK (unit IN ('g','ml','pcs')),
  category VARCHAR(40) NOT NULL DEFAULT 'Other',
  reorder_default NUMERIC(12,3) NOT NULL DEFAULT 0,
  active SMALLINT NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS branch_stock (
  branch_id INT NOT NULL,
  ingredient_id INT NOT NULL,
  qty NUMERIC(14,3) NOT NULL DEFAULT 0,
  reorder_level NUMERIC(12,3) NOT NULL DEFAULT 0,
  unit_cost NUMERIC(12,4) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT LOCALTIMESTAMP,
  PRIMARY KEY (branch_id, ingredient_id)
);

CREATE TABLE IF NOT EXISTS recipe_lines (
  item_id INT NOT NULL,
  ingredient_id INT NOT NULL,
  qty NUMERIC(12,3) NOT NULL,
  PRIMARY KEY (item_id, ingredient_id)
);

CREATE TABLE IF NOT EXISTS stock_moves (
  id BIGSERIAL PRIMARY KEY,
  branch_id INT NOT NULL,
  ingredient_id INT NOT NULL,
  change_qty NUMERIC(14,3) NOT NULL,
  balance NUMERIC(14,3) NOT NULL,
  kind VARCHAR(10) NOT NULL CHECK (kind IN ('IN','SALE','WASTE','ADJUST','RETURN')),
  order_id INT NULL,
  note VARCHAR(160) NULL,
  staff_id INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP
);
CREATE INDEX IF NOT EXISTS stock_moves_branch_created ON stock_moves (branch_id, created_at);
CREATE INDEX IF NOT EXISTS stock_moves_branch_ing ON stock_moves (branch_id, ingredient_id);

CREATE TABLE IF NOT EXISTS idem_keys (
  branch_id INT NOT NULL,
  ref VARCHAR(64) NOT NULL,
  response TEXT NULL,
  created_at TIMESTAMP DEFAULT LOCALTIMESTAMP,
  PRIMARY KEY (branch_id, ref)
);
CREATE INDEX IF NOT EXISTS idem_keys_created ON idem_keys (created_at);

CREATE TABLE IF NOT EXISTS purchases (
  id BIGSERIAL PRIMARY KEY,
  branch_id INT NOT NULL,
  supplier VARCHAR(60) NOT NULL,
  invoice_no VARCHAR(60) NULL,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  items INT NOT NULL DEFAULT 0,
  note VARCHAR(160) NULL,
  staff_id INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT LOCALTIMESTAMP
);
CREATE INDEX IF NOT EXISTS purchases_branch_created ON purchases (branch_id, created_at);
