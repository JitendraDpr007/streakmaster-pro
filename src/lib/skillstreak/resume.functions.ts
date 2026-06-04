import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ReviewInput = z.object({
  resume: z.string().min(50).max(20000),
  targetRole: z.string().max(120).optional(),
  targetCompany: z.string().max(120).optional(),
});

export const reviewResume = createServerFn({ method: "POST" })
  .inputValidator((input) => ReviewInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return {
        ok: false as const,
        error: "AI service is not configured. Please contact support.",
      };
    }

    const systemPrompt = `You are a brutally honest senior engineering hiring manager who has reviewed 5000+ resumes for top product companies (Google, Uber, Razorpay, Flipkart, Atlassian).

Return STRICT JSON only, no markdown, in this exact shape:
{
  "atsScore": <0-100 integer>,
  "verdict": "<one-line punchy verdict>",
  "strengths": ["...", "..."],   // 3-5 items, each <= 18 words
  "weaknesses": ["...", "..."],  // 3-5 items, each <= 18 words
  "rewrites": [                   // 3 example bullet rewrites
    { "before": "<original line from resume>", "after": "<improved STAR-style version with metric>" }
  ],
  "missingKeywords": ["...", "..."],   // 5-8 ATS keywords missing for the target role
  "nextSteps": ["...", "..."]          // 3-5 prioritized action items
}

Rules:
- Be SPECIFIC. Quote actual lines from the resume.
- Use Indian tech context (Razorpay, Flipkart, etc.) when relevant.
- ATS score below 60 = needs major rewrite. 60-75 = decent. 75+ = strong.
- Be honest. No fluff. No generic advice.`;

    const userPrompt = `Target role: ${data.targetRole ?? "Software Engineer"}
Target company: ${data.targetCompany ?? "Top product-based companies"}

RESUME:
${data.resume}`;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          return {
            ok: false as const,
            error: "Too many requests. Please wait a minute and try again.",
          };
        }
        if (res.status === 402) {
          return {
            ok: false as const,
            error: "AI credits exhausted. Please contact the SkillStreak team.",
          };
        }
        const text = await res.text();
        console.error("AI gateway error", res.status, text);
        return { ok: false as const, error: "AI review failed. Please try again." };
      }

      const json = await res.json();
      const content = json?.choices?.[0]?.message?.content;
      if (!content) {
        return { ok: false as const, error: "Empty response from AI." };
      }
      const parsed = JSON.parse(content);
      return { ok: true as const, review: parsed };
    } catch (err) {
      console.error("Resume review error", err);
      return { ok: false as const, error: "Something went wrong. Please try again." };
    }
  });
