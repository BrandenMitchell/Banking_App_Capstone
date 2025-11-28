const fetch = require("node-fetch");

const DEFAULT_LLM_URL = process.env.LOCAL_LLM_URL || "http://localhost:11434/api/chat";
const DEFAULT_LLM_MODEL = process.env.LOCAL_LLM_MODEL || "llama3";

const sanitizeMessages = (messages = []) =>
  messages
    .filter(
      (msg) =>
        msg &&
        typeof msg.content === "string" &&
        msg.content.trim().length > 0 &&
        (msg.role === "user" || msg.role === "assistant")
    )
    .map((msg) => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content.trim(),
    }));

const chatWithLLM = async (req, res) => {
  try {
    const normalizedMessages = sanitizeMessages(req.body?.messages);

    if (!Array.isArray(req.body?.messages) || normalizedMessages.length === 0) {
      return res.status(400).json({ message: "messages[] with role/content is required" });
    }

    const llmResponse = await fetch(DEFAULT_LLM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: DEFAULT_LLM_MODEL,
        messages: normalizedMessages,
        stream: false,
      }),
    });

    if (!llmResponse.ok) {
      const errorText = await llmResponse.text();
      return res
        .status(502)
        .json({ message: "Local LLM request failed", llmStatus: llmResponse.status, errorText });
    }

    const data = await llmResponse.json();
    const reply =
      data?.message?.content ||
      (Array.isArray(data?.messages) && data.messages.length
        ? data.messages[data.messages.length - 1].content
        : undefined) ||
      data?.response ||
      "";

    if (!reply) {
      return res.status(502).json({ message: "LLM replied without content", raw: data });
    }

    return res.json({ reply: reply.trim(), raw: data });
  } catch (error) {
    console.error("chatWithLLM error:", error);
    return res.status(500).json({ message: "Unable to reach local LLM service" });
  }
};

module.exports = { chatWithLLM };

