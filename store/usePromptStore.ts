import { create } from 'zustand';

interface PromptState {
  allPrompts: any[]; 
  selectedPrompt: any | null;
  setAllPrompts: (prompts: any[]) => void;
  setSelectedPrompt: (prompt: any) => void;
}

export const usePromptStore = create<PromptState>((set) => ({
  allPrompts: [], 
  selectedPrompt: null,
  setAllPrompts: (prompts) => set({ allPrompts: prompts }),
  setSelectedPrompt: (prompt) => set({ selectedPrompt: prompt }),
}));