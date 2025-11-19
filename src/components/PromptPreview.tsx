"use client";

import { useMemo, useState } from "react";
import { buildPrompt } from "@/lib/prompt";
import { PromptState } from "@/lib/types";

export function PromptPreview({ state }: { state: PromptState }) {
  const prompt = useMemo(() => buildPrompt(state), [state]);
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  function downloadTxt() {
    const blob = new Blob([prompt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prompt.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-gray-200">Final Prompt</h2>
        <div className="flex gap-2">
          <button
            onClick={onCopy}
            className="rounded bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500"
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={downloadTxt}
            className="rounded border border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-200 hover:bg-gray-800"
          >
            Download
          </button>
        </div>
      </div>
      <pre className="flex-1 overflow-auto whitespace-pre-wrap rounded-md border border-gray-700 bg-gray-950 p-4 text-sm text-gray-100">
{prompt}
      </pre>
    </div>
  );
}
