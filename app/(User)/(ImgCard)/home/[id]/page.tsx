'use client';

import { usePromptStore } from '@/store/usePromptStore';
import { useState } from 'react';
import { Check, Copy, ArrowLeft } from 'lucide-react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PromptDetailPage() {
  const router = useRouter();
  const { selectedPrompt, allPrompts } = usePromptStore();
  const [copied, setCopied] = useState(false);

  if (!selectedPrompt) {
    return <div className="h-screen flex items-center justify-center">No prompt selected.</div>;
  }

  // 1. Fix "Prompt not showing": Check multiple possible property names
  const promptText = selectedPrompt.content || selectedPrompt.text || "No prompt text available";

  const mediaUrl = selectedPrompt.media?.[0]?.url;
  const isVideo = mediaUrl && /\.(mp4|webm|ogg|mov)$/i.test(mediaUrl);

  // 2. Find all prompts that use the SAME image/video URL
  const relatedPrompts = allPrompts.filter(
    (p) => p.media?.[0]?.url === mediaUrl && p.id !== selectedPrompt.id
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
            {/* CHANGE THIS PART: Replace <Link> with a <button> */}
      <button 
        onClick={() => router.back()} 
        className="flex items-center text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" /> 
        Back
      </button>


      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Media */}
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-square">
          {isVideo ? (
            <video src={mediaUrl} controls autoPlay loop className="w-full h-full object-contain" />
          ) : (
            <img src={mediaUrl} alt={selectedPrompt.title} className="w-full h-full object-contain" />
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{selectedPrompt.title}</h1>
          
          <div className="relative p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
            <p className="text-gray-800 dark:text-gray-200 pr-12">{promptText}</p>
            <button onClick={handleCopy} className="absolute top-4 right-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          {/* SAME IMAGE LIST (Related Prompts) */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
              Other prompts using this image
            </h3>
            {relatedPrompts.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {relatedPrompts.map((rel) => (
                  <div 
                    key={rel.id} 
                    onClick={() => {
                      usePromptStore.setState({ selectedPrompt: rel });
                      // We don't need router.push because we just updated the store state
                    }}
                    className="cursor-pointer group p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-all"
                  >
                    <p className="text-xs font-medium truncate text-gray-600 dark:text-gray-400">{rel.title}</p>
                    <p className="text-[10px] text-gray-400 line-clamp-1">{rel.text || rel.prompt}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No other prompts found for this image.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}