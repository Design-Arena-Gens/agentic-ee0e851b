"use client";
import { useState } from "react";
import { PromptForm } from "@/components/PromptForm";
import { PromptPreview } from "@/components/PromptPreview";
import { PromptState } from "@/lib/types";

export default function Home() {
  const [state, setState] = useState<PromptState | null>(null);
  return (
    <div className="min-h-screen bg-black text-gray-100">
      <header className="border-b border-gray-800 bg-black/60 backdrop-blur supports-[backdrop-filter]:bg-black/40 sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-500" />
            <h1 className="text-sm font-semibold tracking-wide">Prompt Maker AI</h1>
          </div>
          <a
            href="https://vercel.com/"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-gray-400 hover:text-gray-200"
          >
            Deploy on Vercel
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="space-y-6">
          <PromptForm onChange={(s) => setState(s)} />
        </section>
        <aside className="lg:h-[calc(100vh-5rem)] sticky top-20">
          {state && <PromptPreview state={state} />}
        </aside>
      </main>
    </div>
  );
}
