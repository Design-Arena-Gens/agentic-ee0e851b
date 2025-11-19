import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = (await req.json()) as { prompt: any };
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ patch: null }, { status: 200 });
    }

    const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const sys = [
      "You improve prompt blueprints.",
      "Return ONLY a compact JSON patch with optional keys that refine the prompt state.",
      "Prefer improving styleGuidelines, constraints, steps, and outputFormat for clarity.",
      "Never include secrets or unsafe instructions.",
    ].join(" ");

    const user = JSON.stringify({ state: prompt });

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          { role: "system", content: sys },
          {
            role: "user",
            content:
              "Given this prompt-building state, return a JSON object with a 'patch' key. The patch may include updated styleGuidelines, constraints, steps, outputFormat, or systemPreamble. Keep it minimal and high-signal.\n\n" +
              user,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ patch: null }, { status: 200 });
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content ?? "{}";
    let parsed: any = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {};
    }
    return NextResponse.json({ patch: parsed.patch || null }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ patch: null }, { status: 200 });
  }
}
