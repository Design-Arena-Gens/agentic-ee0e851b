"use client";

import { useState, KeyboardEvent } from "react";

export function TagInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function addTag(value: string) {
    const v = value.trim();
    if (!v) return;
    if (values.includes(v)) return;
    onChange([...values, v]);
    setDraft("");
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(draft);
    }
    if (e.key === "Backspace" && draft.length === 0 && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-200 mb-1">
        {label}
      </label>
      <div className="flex flex-wrap gap-2 items-center rounded-md border border-gray-700 bg-gray-900 px-2 py-2">
        {values.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 rounded bg-gray-700 px-2 py-1 text-xs text-gray-100"
          >
            {v}
            <button
              aria-label={`Remove ${v}`}
              className="text-gray-300 hover:text-white"
              onClick={() => onChange(values.filter((x) => x !== v))}
            >
              ?
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => addTag(draft)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm text-gray-100 placeholder:text-gray-500"
        />
      </div>
    </div>
  );
}
