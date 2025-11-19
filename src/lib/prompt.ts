import { PromptState } from "./types";

export function trimLines(value: string): string {
  return value
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n")
    .trim();
}

export function normalizeList(values: string[]): string[] {
  return values
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

export function buildPrompt(state: PromptState): string {
  const sections: string[] = [];

  const sys = state.systemPreamble.trim();
  if (sys) {
    sections.push(`System\n${sys}`);
  }

  const roleParts: string[] = [];
  if (state.role.trim()) roleParts.push(state.role.trim());
  if (state.audience.trim()) roleParts.push(`for ${state.audience.trim()}`);
  if (roleParts.length) {
    sections.push(`Role\n${roleParts.join(" ")}`);
  }

  if (state.objective.trim()) {
    sections.push(`Objective\n${state.objective.trim()}`);
  }

  if (state.context.trim()) {
    sections.push(`Context\n${trimLines(state.context)}`);
  }

  const constraints = normalizeList(state.constraints);
  if (constraints.length) {
    sections.push(
      `Constraints\n${constraints.map((c, i) => `${i + 1}. ${c}`).join("\n")}`
    );
  }

  const steps = normalizeList(state.steps);
  if (steps.length) {
    sections.push(`Process\n${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`);
  }

  const keywords = normalizeList(state.keywords);
  const avoid = normalizeList(state.avoid);
  if (keywords.length || avoid.length) {
    const lines: string[] = [];
    if (keywords.length) lines.push(`Use: ${keywords.join(", ")}`);
    if (avoid.length) lines.push(`Avoid: ${avoid.join(", ")}`);
    sections.push(`Vocabulary\n${lines.join("\n")}`);
  }

  const examples = state.examples.filter((ex) => ex.input.trim().length > 0);
  if (examples.length) {
    const exBlocks = examples
      .map((ex, idx) => {
        const title = ex.title?.trim() || `Example ${idx + 1}`;
        const input = trimLines(ex.input);
        const output = trimLines(ex.output || "");
        return [
          `- ${title}:`,
          input ? `Input:\n${input}` : "",
          output ? `Expected:\n${output}` : "",
        ]
          .filter(Boolean)
          .join("\n");
      })
      .join("\n\n");
    sections.push(`Few-shot Examples\n${exBlocks}`);
  }

  if (state.tone.trim() || state.styleGuidelines.trim()) {
    const lines: string[] = [];
    if (state.tone.trim()) lines.push(`Tone: ${state.tone.trim()}`);
    if (state.styleGuidelines.trim())
      lines.push(`Style: ${trimLines(state.styleGuidelines)}`);
    sections.push(`Style\n${lines.join("\n")}`);
  }

  if (state.outputFormat.trim()) {
    sections.push(`Output Format\n${trimLines(state.outputFormat)}`);
  }

  if (state.language.trim()) {
    sections.push(`Language\n${state.language.trim()}`);
  }

  const meta: string[] = [];
  if (state.modelPreference.trim()) meta.push(`Model: ${state.modelPreference}`);
  if (state.temperature != null) meta.push(`Temperature: ${state.temperature}`);
  if (state.maxTokens != null) meta.push(`Max Tokens: ${state.maxTokens}`);
  if (meta.length) sections.push(`Generation Preferences\n${meta.join("\n")}`);

  return sections.map((s) => s.trim()).filter(Boolean).join("\n\n");
}

export function defaultPromptState(): PromptState {
  return {
    role: "World-class expert agent",
    audience: "Product engineers and researchers",
    objective: "Produce the best possible prompt for the user's task.",
    context: "",
    constraints: [
      "Be specific and unambiguous.",
      "Ask for missing information succinctly.",
      "No private data or secrets.",
    ],
    tone: "Concise, direct, expert",
    styleGuidelines: "Prefer lists and structure over prose when helpful.",
    outputFormat:
      "Return a final prompt under a `Final Prompt` heading. If clarifying questions are needed, include them first under a `Questions` heading.",
    language: "English",
    steps: [
      "Clarify the goal in one sentence.",
      "List key constraints and success criteria.",
      "Propose structure and outputs.",
      "Assemble final prompt in sections.",
    ],
    keywords: ["precise", "robust", "reproducible"],
    avoid: ["vague terms", "unbounded scopes"],
    examples: [],
    modelPreference: "gpt-4o-mini",
    temperature: 0.2,
    maxTokens: 800,
    systemPreamble:
      "You are a careful prompt engineer. Produce prompts optimized for clarity, safety, and performance.",
  };
}

export function encodeState(state: any): string {
  try {
    const json = JSON.stringify(state);
    return Buffer.from(json, "utf-8").toString("base64url");
  } catch {
    return "";
  }
}

export function decodeState<T>(encoded: string | null): T | null {
  if (!encoded) return null;
  try {
    const json = Buffer.from(encoded, "base64url").toString("utf-8");
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
