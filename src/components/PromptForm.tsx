"use client";

import { useEffect, useMemo, useState } from "react";
import { ExampleEditor } from "@/components/ExampleEditor";
import { TagInput } from "@/components/TagInput";
import { TemplateSelector } from "@/components/TemplateSelector";
import { defaultPromptState, encodeState, decodeState } from "@/lib/prompt";
import { PromptState } from "@/lib/types";

function useQueryState() {
  const [initial, setInitial] = useState<PromptState | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const s = decodeState<PromptState>(params.get("s"));
      if (s) setInitial(s);
    } catch {}
  }, []);

  return initial;
}

export function PromptForm({ onChange }: { onChange: (s: PromptState) => void }) {
  const queryState = useQueryState();
  const [state, setState] = useState<PromptState>(queryState || defaultPromptState());

  useEffect(() => {
    onChange(state);
    try {
      localStorage.setItem("prompt-maker-state", JSON.stringify(state));
    } catch {}
  }, [state, onChange]);

  useEffect(() => {
    if (!queryState) {
      try {
        const raw = localStorage.getItem("prompt-maker-state");
        if (raw) setState(JSON.parse(raw));
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shareUrl = useMemo(() => {
    try {
      const base = window.location.origin + window.location.pathname;
      const s = encodeState(state);
      return `${base}?s=${s}`;
    } catch {
      return "";
    }
  }, [state]);

  async function copyShare() {
    await navigator.clipboard.writeText(shareUrl);
  }

  async function improvePrompt() {
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: state }),
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.patch) {
        setState((s) => ({ ...s, ...data.patch }));
      }
    } catch {}
  }

  function applyPatch(patch: Partial<PromptState>) {
    setState((prev) => ({ ...prev, ...patch }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-100">Prompt Builder</h2>
        <div className="flex gap-2">
          <button
            onClick={copyShare}
            className="rounded border border-gray-700 px-3 py-1.5 text-sm text-gray-200 hover:bg-gray-800"
          >
            Share
          </button>
          <button
            onClick={improvePrompt}
            className="rounded bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Improve (AI)
          </button>
        </div>
      </div>

      <TemplateSelector onApply={applyPatch} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Role</label>
              <input
                value={state.role}
                onChange={(e) => setState({ ...state, role: e.target.value })}
                className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Audience</label>
              <input
                value={state.audience}
                onChange={(e) => setState({ ...state, audience: e.target.value })}
                className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Objective</label>
            <textarea
              value={state.objective}
              onChange={(e) => setState({ ...state, objective: e.target.value })}
              rows={2}
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Context</label>
            <textarea
              value={state.context}
              onChange={(e) => setState({ ...state, context: e.target.value })}
              rows={4}
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100"
            />
          </div>

          <TagInput
            label="Constraints"
            values={state.constraints}
            onChange={(v) => setState({ ...state, constraints: v })}
            placeholder="Add a constraint and press Enter"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Tone</label>
              <input
                value={state.tone}
                onChange={(e) => setState({ ...state, tone: e.target.value })}
                className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Language</label>
              <input
                value={state.language}
                onChange={(e) => setState({ ...state, language: e.target.value })}
                className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Style guidelines</label>
            <textarea
              value={state.styleGuidelines}
              onChange={(e) => setState({ ...state, styleGuidelines: e.target.value })}
              rows={3}
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Output format</label>
            <textarea
              value={state.outputFormat}
              onChange={(e) => setState({ ...state, outputFormat: e.target.value })}
              rows={3}
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">System preamble</label>
            <textarea
              value={state.systemPreamble}
              onChange={(e) => setState({ ...state, systemPreamble: e.target.value })}
              rows={3}
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100"
            />
          </div>

          <TagInput
            label="Process steps"
            values={state.steps}
            onChange={(v) => setState({ ...state, steps: v })}
            placeholder="Add a step and press Enter"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TagInput
              label="Keywords to use"
              values={state.keywords}
              onChange={(v) => setState({ ...state, keywords: v })}
              placeholder="Add a keyword"
            />
            <TagInput
              label="Things to avoid"
              values={state.avoid}
              onChange={(v) => setState({ ...state, avoid: v })}
              placeholder="Add an item to avoid"
            />
          </div>

          <ExampleEditor
            examples={state.examples}
            onChange={(v) => setState({ ...state, examples: v })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Model preference</label>
              <input
                value={state.modelPreference}
                onChange={(e) => setState({ ...state, modelPreference: e.target.value })}
                className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Temperature</label>
              <input
                type="number"
                step="0.1"
                min={0}
                max={2}
                value={state.temperature}
                onChange={(e) => setState({ ...state, temperature: Number(e.target.value) })}
                className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Max tokens</label>
              <input
                type="number"
                min={1}
                value={state.maxTokens}
                onChange={(e) => setState({ ...state, maxTokens: Number(e.target.value) })}
                className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
