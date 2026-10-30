import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../server/src/app.js';

let server, base;
before(async () => {
  server = createApp().listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://localhost:${server.address().port}`;
});
after(() => server.close());

const post = (body) =>
  fetch(`${base}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const valid = { name: 'Asha', email: 'asha@example.com', subject: 'Hello there', message: 'This is a long enough message.' };

test('rejects invalid payload with 400', async () => {
  const res = await post({ ...valid, email: 'nope' });
  assert.equal(res.status, 400);
  assert.ok((await res.json()).errors.email);
});
test('returns 503 when SMTP is not configured', async () => {
  const res = await post(valid);
  assert.equal(res.status, 503);
});
test('honeypot gets silent success without sending', async () => {
  const res = await post({ ...valid, website: 'http://spam' });
  assert.equal(res.status, 200);
});
