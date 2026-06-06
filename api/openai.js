const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

function getOutputText(data) {
  if (typeof data.output_text === "string") return data.output_text;
  if (!Array.isArray(data.output)) return "";
  return data.output
    .flatMap(item => Array.isArray(item.content) ? item.content : [])
    .map(part => part.text || part.content || "")
    .filter(Boolean)
    .join("\n");
}

function normalizeModel(model) {
  // Cost-saving guard: the current frontend may still request gpt-4.1 for post generation.
  // Route it to gpt-4.1-mini so operation tests stay inexpensive.
  if (model === "gpt-4.1") return "gpt-4.1-mini";
  return model;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }

  try {
    const clientKey = req.headers["x-openai-key"];
    const apiKey = clientKey || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ error: { message: "OpenAI API key is not configured" } });
    }

    const { model, instructions, input, max_output_tokens, tools } = req.body || {};
    if (!model || !input) {
      return res.status(400).json({ error: { message: "model and input are required" } });
    }

    const upstream = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: normalizeModel(model),
        instructions,
        input,
        max_output_tokens: max_output_tokens || 1200,
        tools: tools || [],
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      return res.status(upstream.status).json(data);
    }

    return res.status(200).json({ ...data, output_text: getOutputText(data) });
  } catch (error) {
    return res.status(500).json({ error: { message: error?.message || "OpenAI proxy error" } });
  }
}
