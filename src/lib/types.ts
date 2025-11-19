export type FewShotExample = {
  title: string;
  input: string;
  output?: string;
};

export type PromptTemplate = {
  id: string;
  name: string;
  description: string;
  seed: Partial<PromptState>;
};

export type PromptState = {
  role: string;
  audience: string;
  objective: string;
  context: string;
  constraints: string[];
  tone: string;
  styleGuidelines: string;
  outputFormat: string;
  language: string;
  steps: string[];
  keywords: string[];
  avoid: string[];
  examples: FewShotExample[];
  modelPreference: string;
  temperature: number;
  maxTokens: number;
  systemPreamble: string;
};
