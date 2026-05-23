'use client';

import { useEffect } from 'react';
import { BottomNav } from "@/app/components/Home/bottom-nav";
import { PromptCardSimple } from "../../../app/components/Home/prompt-card"; // Adjust path
import { TRENDING_PROMPTS } from "@/data/trending"; // Import your manual data
import { usePromptStore } from '@/store/usePromptStore';

export default function TrendingPage() {
  const setAllPrompts = usePromptStore((state) => state.setAllPrompts);

  useEffect(() => {
    // Push the manual data into the global store so the Detail Page works
    setAllPrompts(TRENDING_PROMPTS);
  }, [setAllPrompts]);

  return (
    <div className="min-h-screen bg-white dark:bg-black pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black dark:text-white">Trending</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            The most popular AI prompts this week.
          </p>
        </div>

        {/* The Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {TRENDING_PROMPTS.map((prompt, index) => (
            <PromptCardSimple 
              key={prompt.id} 
              prompt={prompt} 
              index={index} 
            />
          ))}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}