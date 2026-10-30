export const notFound = (_req, res) => res.status(404).json({ ok: false, message: 'Not found.' });

export function errorHandler(err, _req, res, _next) {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ ok: false, message: 'Invalid JSON.' });
  if (err.type === 'entity.too.large') return res.status(413).json({ ok: false, message: 'Payload too large.' });

  console.error(`[error] ${err.code || ''} ${err.message}`);
  res.status(err.status || 500).json({
    ok: false,
    message: err.expose ? err.message : 'Could not send your message right now. Please try again later.',
  });
}
