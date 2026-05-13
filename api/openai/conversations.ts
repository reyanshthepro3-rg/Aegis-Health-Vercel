export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    return res.end(JSON.stringify({ error: "Method not allowed." }));
  }

  try {
    let body = "";
    for await (const chunk of req) {
      body += chunk;
    }

    const data = body ? JSON.parse(body) : {};
    const title = typeof data.title === "string" ? data.title.trim() : "";
    if (!title) {
      res.statusCode = 400;
      res.setHeader("content-type", "application/json");
      return res.end(JSON.stringify({ error: "Title is required." }));
    }

    const conversationId = Date.now();
    res.statusCode = 201;
    res.setHeader("content-type", "application/json");
    return res.end(JSON.stringify({ id: conversationId, title, createdAt: new Date().toISOString() }));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("content-type", "application/json");
    return res.end(JSON.stringify({ error: "Failed to create conversation." }));
  }
}
