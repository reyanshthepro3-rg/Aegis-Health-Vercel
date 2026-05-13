const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const content = typeof body.content === "string" ? body.content.trim() : "";
    if (!content) {
      return new Response(JSON.stringify({ error: "Message content is required." }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return new Response(JSON.stringify({ error: "OpenAI API key is missing." }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
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
      return new Response(JSON.stringify({ error: errorText || "OpenAI request failed." }), {
        status: openaiResponse.status,
        headers: { "content-type": "application/json" },
      });
    }

    return new Response(openaiResponse.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "AI request failed." }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
