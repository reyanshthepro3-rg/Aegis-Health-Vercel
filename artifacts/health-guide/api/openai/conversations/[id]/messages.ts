const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

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
    const content = typeof data.content === "string" ? data.content.trim() : "";
    if (!content) {
      res.statusCode = 400;
      res.setHeader("content-type", "application/json");
      return res.end(JSON.stringify({ error: "Message content is required." }));
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      res.statusCode = 500;
      res.setHeader("content-type", "application/json");
      return res.end(JSON.stringify({ error: "OpenAI API key is missing." }));
    }

    const openaiResponse = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        stream: true,
        messages: [
          {
            role: "system",
            content:
              "You are Dr. Mahajan, a friendly and knowledgeable medical assistant. Answer health questions clearly, safely, and professionally.",
          },
          {
            role: "user",
            content,
          },
        ],
      }),
    });

    if (!openaiResponse.ok || !openaiResponse.body) {
      const errorText = await openaiResponse.text();
      res.statusCode = openaiResponse.status;
      res.setHeader("content-type", "application/json");
      return res.end(JSON.stringify({ error: errorText || "OpenAI request failed." }));
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of openaiResponse.body) {
      res.write(Buffer.from(chunk));
    }
    return res.end();
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("content-type", "application/json");
    return res.end(JSON.stringify({ error: "AI request failed." }));
  }
}
