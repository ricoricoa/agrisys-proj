// Lightweight server-sent events hub. Only event names/timestamps are sent;
// each signed-in screen fetches its own authorised data after an update.
const subscribers = new Set();

export function subscribeToRealtimeUpdates(req, res) {
  res.status(200);
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no"
  });
  res.flushHeaders?.();
  res.write(`event: connected\ndata: ${JSON.stringify({ at: new Date().toISOString() })}\n\n`);

  const subscriber = { res };
  subscribers.add(subscriber);
  const keepAlive = setInterval(() => res.write(": keep-alive\n\n"), 25_000);
  req.on("close", () => {
    clearInterval(keepAlive);
    subscribers.delete(subscriber);
  });
}

export function publishRealtimeUpdate(type) {
  const payload = `event: update\ndata: ${JSON.stringify({ type, at: new Date().toISOString() })}\n\n`;
  for (const { res } of subscribers) {
    try { res.write(payload); } catch { /* Connection cleanup is handled by close. */ }
  }
}
