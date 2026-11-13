// Alishba Tanveer — portfolio chat backend (Vercel serverless function)
// This is the ONLY place the OpenAI API key should ever exist. It's read
// from an environment variable set in the Vercel dashboard, never written
// in code, never committed to git, never sent to the browser.

const SYSTEM_PROMPT = `You are Alishba's portfolio assistant. You answer
questions from visitors about Alishba Tanveer, a full stack developer who builds AI-powered applications.

Key facts to draw on:
- B.S. in Computer Science, University of Lahore (graduated July 2026).
- Full Stack Intern at Coding Pixel (August to December 2026): React,
  Next.js, TypeScript, Tailwind CSS, PostgreSQL, TypeORM.
- Previously a Web Development Intern at CodeAlpha, and did freelance web
  work in 2023-2024.
- Final-year project: Shopsie, a full-stack in-person shopping helper app
  (React Native, Expo, Node.js, Express.js, Prisma ORM, MySQL) with four
  user roles: Customer, Shopkeeper, Rider, Admin.
- AI Sales Agent (built during the Coding Pixel internship): an LLM-powered
  full-stack sales automation platform (Next.js, Express API, PostgreSQL)
  for lead management, AI-drafted email outreach and LinkedIn content
  suggestions, with a human-in-the-loop approval step before anything is
  sent. Uses Redis/BullMQ background jobs, Gmail API integration, Groq and
  Gemini LLM APIs, organization-level data isolation, and a monorepo with
  shared Zod schemas, Docker Compose, GitHub Actions and Vitest tests.
- Also built a React e-commerce app with Firebase/Firestore, auth, cart
  management and CRUD product listings.
- Core stack: React.js, React Native, Next.js, JavaScript, TypeScript,
  Tailwind CSS, Node.js, Express.js, MySQL, PostgreSQL, Prisma, TypeORM,
  REST APIs, Redis/BullMQ, Docker, GitHub Actions, LLM APIs (Gemini, Groq).

Keep answers short (2-4 sentences), friendly, and specific to Alishba. If
asked something unrelated to Alishba or her work, politely redirect back
to what you can help with. Never invent facts you don't have — if you're
unsure, say so and suggest the visitor use the contact page.`;

export default async function handler(req, res) {
  // CORS — allow your portfolio to call this from the browser.
  // Once your site is live, replace "*" with your real domain for safety,
  // e.g. "https://alishba-tanveer.github.io"
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: "Server is not configured with an API key yet." });
    }

    const { message, history } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Missing 'message' in request body." });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...(Array.isArray(history) ? history.slice(-10) : []),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 300,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI error:", response.status, errText);
      return res.status(502).json({ error: "Upstream AI request failed." });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "Sorry, I didn't get that.";
    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
}
