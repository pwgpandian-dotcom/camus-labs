// Temporary: finds which Supabase pooler host this project uses. Protected by APP_SECRET. Removed after setup.
const { Client } = require('pg');
module.exports = async (req, res) => {
  if (req.query.k !== process.env.APP_SECRET) return res.status(403).end('no');
  const ref = process.env.SUPABASE_REF, pass = process.env.DB_PASS, out = [];
  for (const h of ['aws-0-ap-south-1', 'aws-1-ap-south-1', 'aws-2-ap-south-1']) for (const port of [6543]) {
    const c = new Client({ host: h + '.pooler.supabase.com', port, user: 'aurum_app.' + ref, password: pass, database: 'postgres', ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 6000 });
    try { await c.connect(); const r = await c.query("select current_user u, current_setting('TimeZone') tz, (select count(*) from items) n"); out.push({ h, port, ok: r.rows[0] }); await c.end(); }
    catch (e) { out.push({ h, port, err: e.message }); try { await c.end(); } catch (_) {} }
  }
  res.json(out);
};
