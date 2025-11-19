"use client";

import { useState } from "react";
import { FewShotExample } from "@/lib/types";

export function ExampleEditor({
  examples,
  onChange,
}: {
  examples: FewShotExample[];
  onChange: (next: FewShotExample[]) => void;
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  function add() {
    onChange([
      ...examples,
      { title: `Example ${examples.length + 1}`, input: "", output: "" },
    ]);
    setExpandedIndex(examples.length);
  }

  function remove(idx: number) {
    const next = examples.filter((_, i) => i !== idx);
    onChange(next);
    setExpandedIndex(null);
  }

  function update(idx: number, patch: Partial<FewShotExample>) {
    const next = examples.map((ex, i) => (i === idx ? { ...ex, ...patch } : ex));
    onChange(next);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-200">Few-shot examples</label>
        <button
          onClick={add}
          className="rounded bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Add example
        </button>
      </div>
      <div className="mt-3 space-y-3">
        {examples.map((ex, idx) => (
          <div key={idx} className="rounded-md border border-gray-700">
            <button
              type="button"
              onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
              className="w-full flex items-center justify-between px-3 py-2 text-left"
            >
              <span className="text-sm text-gray-100">{ex.title || `Example ${idx + 1}`}</span>
              <span className="text-gray-400">{expandedIndex === idx ? "?" : "+"}</span>
            </button>
            {expandedIndex === idx && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border-t border-gray-700">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Title</label>
                  <input
                    value={ex.title}
                    onChange={(e) => update(idx, { title: e.target.value })}
                    className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs text-gray-400 mb-1">Input</label>
                  <textarea
                    value={ex.input}
                    onChange={(e) => update(idx, { input: e.target.value })}
                    rows={6}
                    className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs text-gray-400 mb-1">Expected Output (optional)</label>
                  <textarea
                    value={ex.output || ""}
                    onChange={(e) => update(idx, { output: e.target.value })}
                    rows={6}
                    className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100"
                  />
                </div>
                <div className="flex justify-end gap-2 md:col-span-2">
                  <button
                    onClick={() => remove(idx)}
                    className="rounded border border-red-700 text-red-300 hover:bg-red-950 px-3 py-1.5 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {examples.length === 0 && (
          <p className="text-sm text-gray-500">No examples yet. Add one to guide outputs.</p>
        )}
      </div>
    </div>
  );
}
