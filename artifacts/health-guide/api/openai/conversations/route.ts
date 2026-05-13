export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    if (!title) {
      return new Response(JSON.stringify({ error: "Title is required." }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const conversationId = Date.now();
    return new Response(
      JSON.stringify({ id: conversationId, title, createdAt: new Date().toISOString() }),
      {
        status: 201,
        headers: { "content-type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create conversation." }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
