"use client";

import { PromptTemplate, PromptState } from "@/lib/types";

const templates: PromptTemplate[] = [
  {
    id: "bug-fixer",
    name: "Bug Fixer (Code)",
    description: "Diagnose and propose fixes for code issues",
    seed: {
      role: "Senior software engineer and debugger",
      objective:
        "Identify root cause and propose minimal, safe code changes with reasoning.",
      steps: [
        "Restate suspected issue and scope.",
        "Propose 1-2 likely root causes.",
        "Provide minimal diff or snippet to fix.",
        "Add tests or checks to prevent regression.",
      ],
      outputFormat:
        "Return sections: Summary, Root Cause, Fix (code), Tests, Risks, Next Steps.",
      keywords: ["stack trace", "reproduction", "regression"],
      modelPreference: "gpt-4o-mini",
    },
  },
  {
    id: "code-review",
    name: "Code Review", 
    description: "Structured code review prompts",
    seed: {
      role: "Staff engineer code reviewer",
      objective: "Review the following code and provide actionable feedback.",
      constraints: ["Be specific and cite lines.", "Prefer clarity over cleverness."],
      steps: [
        "Assess correctness and edge cases.",
        "Evaluate readability and naming.",
        "Check performance and resource usage.",
        "Flag security and privacy issues.",
      ],
      outputFormat:
        "Return sections: Summary, Major Issues, Suggestions, Questions, Suggested Refactor (if any).",
    },
  },
  {
    id: "product-spec",
    name: "Product Spec", 
    description: "Draft or refine product specifications",
    seed: {
      role: "Product manager and UX writer",
      objective: "Create a crisp product spec for the following feature.",
      steps: [
        "Define problem and goals.",
        "List user stories and acceptance criteria.",
        "Non-functional requirements.",
        "Open questions.",
      ],
      outputFormat:
        "Return sections: Overview, Goals, User Stories, Acceptance Criteria, NFRs, Open Questions.",
    },
  },
  {
    id: "sql-gen",
    name: "SQL Generator", 
    description: "Generate safe SQL queries",
    seed: {
      role: "Senior data engineer",
      objective: "Generate a correct and efficient SQL query.",
      constraints: ["Avoid full scans where indexes exist.", "Parameterize inputs."] ,
      steps: ["Summarize the schema.", "Propose query.", "Provide explanation.", "Add indexes if needed."],
      outputFormat: "Return SQL fenced in ```sql and a brief explanation.",
      modelPreference: "gpt-4o-mini",
    },
  },
  {
    id: "marketing-copy",
    name: "Marketing Copy", 
    description: "High-converting copy",
    seed: {
      role: "Conversion copywriter",
      objective: "Write compelling copy for the following offer.",
      tone: "Friendly, high-energy, benefits-first",
      steps: ["Define audience pain points.", "Craft headline.", "Write body.", "CTA variations."],
      outputFormat: "Return 3 variants with headline and CTA options.",
      language: "English",
    },
  },
  {
    id: "research-assistant",
    name: "Research Assistant",
    description: "Plan and synthesize research",
    seed: {
      role: "Research assistant",
      objective: "Plan research steps and synthesize findings.",
      steps: ["Clarify scope.", "Plan research.", "List sources.", "Synthesize findings."],
      outputFormat: "Return Plan and Synthesis sections with citations.",
    },
  },
];

export function TemplateSelector({
  onApply,
}: {
  onApply: (patch: Partial<PromptState>) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-200 mb-1">
        Template
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => onApply(t.seed)}
            className="text-left rounded-md border border-gray-700 bg-gray-900 p-3 hover:border-indigo-500"
          >
            <div className="text-sm font-medium text-gray-100">{t.name}</div>
            <div className="text-xs text-gray-400">{t.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
