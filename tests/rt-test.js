// Live-update check: a second screen must hear about a new bill through Supabase Realtime.
const B = (process.env.URL || 'http://localhost:3000') + '/api';
const j = async (u, o = {}) => { const r = await fetch(B + u, { method: o.body ? 'POST' : 'GET', headers: { 'content-type': 'application/json', ...(o.t ? { authorization: 'Bearer ' + o.t } : {}) }, body: o.body ? JSON.stringify(o.body) : undefined }); const d = await r.json(); if (!r.ok) throw new Error(u + ' ' + JSON.stringify(d)); return d; };
(async () => {
  const t = (await j('/login', { body: { branch_id: 1, pin: '1111' } })).token;
  const boot = await j('/bootstrap', { t });
  if (!boot.rt) { console.log('✗ no realtime config'); process.exit(1); }
  const ws = new WebSocket(boot.rt.url.replace(/^http/, 'ws') + '/realtime/v1/websocket?apikey=' + boot.rt.key + '&vsn=1.0.0');
  const topic = 'realtime:' + boot.rt.topic; const got = []; let joined = false;
  ws.onmessage = (m) => { const x = JSON.parse(m.data); if (x.topic === topic && x.event === 'phx_reply' && x.payload.status === 'ok') joined = true; if (x.event === 'broadcast') got.push(x.payload.event); };
  ws.onopen = () => ws.send(JSON.stringify({ topic, event: 'phx_join', payload: { config: { broadcast: { self: false }, presence: { key: '' }, private: false } }, ref: '1' }));
  for (let i = 0; i < 50 && !joined; i++) await new Promise((r) => setTimeout(r, 100));
  console.log(joined ? '✓ realtime joined' : '✗ realtime join failed');
  const it = boot.items.find((i) => i.available);
  await j('/checkout', { t, body: { order_type: 'PICK_UP', lines: [{ item_id: it.id, qty: 1 }], pay_mode: 'CASH', client_ref: 'rt' + Date.now() } });
  for (let i = 0; i < 60 && !got.includes('bills:changed'); i++) await new Promise((r) => setTimeout(r, 100));
  console.log(got.includes('bills:changed') ? '✓ live update received: ' + got.join(',') : '✗ no live update, got: ' + got.join(','));
  ws.close(); process.exit(0);
})().catch((e) => { console.log('FATAL', e.message); process.exit(1); });
