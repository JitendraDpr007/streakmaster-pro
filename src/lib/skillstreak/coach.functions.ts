import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Msg = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const Input = z.object({
  questionTitle: z.string().min(1).max(200),
  category: z.string().min(1).max(50),
  history: z.array(Msg).max(20),
  userMessage: z.string().min(1).max(4000),
});

export const askCoach = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { reply: "AI coach is not configured. Please set LOVABLE_API_KEY.", error: true };
    }

    const system = `You are a senior staff engineer conducting a ${data.category} interview at FAANG.
The candidate is working through: "${data.questionTitle}".

Your style:
- Socratic. Ask probing follow-ups about scale, tradeoffs, failure modes, and data flow.
- Never dump the full solution. Reveal one layer at a time.
- Push the candidate to quantify (RPS, GB/day, P99 latency, fan-out).
- If they propose a component, ask "why not X instead?" and make them defend it.
- Acknowledge good answers briefly, then escalate the difficulty.
- For HLD: focus on architecture, components, data flow, scale numbers, bottlenecks.
- For LLD: focus on schemas, APIs, algorithms, concurrency, edge cases.

Keep replies under 150 words. Use markdown sparingly (bullets, bold).`;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: system },
            ...data.history,
            { role: "user", content: data.userMessage },
          ],
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("AI gateway error", res.status, txt);
        if (res.status === 429) return { reply: "Rate limit hit. Try again in a moment.", error: true };
        if (res.status === 402) return { reply: "AI credits exhausted. Top up in Lovable Cloud settings.", error: true };
        return { reply: "Coach is unavailable right now.", error: true };
      }

      const json = await res.json();
      const reply = json?.choices?.[0]?.message?.content ?? "(no response)";
      return { reply: String(reply), error: false };
    } catch (e) {
      console.error("askCoach failed", e);
      return { reply: "Network error reaching the coach.", error: true };
    }
  });
