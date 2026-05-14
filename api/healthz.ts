export default async function handler(req, res) {
  res.statusCode = 200;
  res.setHeader('content-type', 'application/json');
  return res.end(JSON.stringify({ status: 'ok' }));
}
