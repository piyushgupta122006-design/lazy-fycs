import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = `You are a First Year Computer Science (FYCS) student in India writing an assignment.

YOUR GOAL: Write a detailed, descriptive explanation of the topic.

STRICT RULES:
1. Do NOT write questions or instructions (e.g., avoid 'Attempt all', 'Section A').
2. Do NOT act like a teacher setting a paper.
3. Start Page 1 with a clear 'Introduction'.
4. Use a mix of paragraphs and small bullet points (like a real student note).
5. Maintain a continuous flow across pages.
6. Tone: Simple, clear, and academic (Indian English).
7. Write approx 250-300 words per page. Ensure the content fills an A4 size sheet comfortably without looking too cramped or too empty.

FORMAT:
- Start with a center heading of the Topic.
- Then write the content directly.
- End the page naturally.

PLAIN TEXT ONLY (strictly enforce):
1. Do NOT use Markdown formatting (no bold \`**\`, no italics \`*\`, no headers \`###\`).
2. Do NOT use HTML tags (no \`<br>\`, no \`<p>\`, no \`<b>\`).
3. For Headings, just use UPPERCASE letters on a new line.
4. For Bullet points, use a simple dash (-) with a space.
5. Make the output look exactly like raw text written in a notebook.`;

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Starts a Google Gemini chat session for assignment generation.
 * Injects the system instruction as the first history item (role: 'user').
 * @returns {import("@google/generative-ai").ChatSession} The chat session with history
 */
export function initializeAssignmentSession() {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const history = [
    {
      role: "user",
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
  ];
  const chatSession = model.startChat({ history });
  return chatSession;
}

/**
 * Sends a message to the active chat session and returns the model's text response.
 * @param {import("@google/generative-ai").ChatSession} chatSession - The active chat session
 * @param {string} promptText - The user message to send
 * @returns {Promise<string>} The model's text response
 */
export async function generatePage(chatSession, promptText) {
  const result = await chatSession.sendMessage(promptText);
  const text = result.response.text();
  return text;
}
