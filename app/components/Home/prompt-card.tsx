'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface PromptCardSimpleProps {
  prompt: any;
  index: number;
}

export function PromptCardSimple({ prompt, index }: PromptCardSimpleProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    if (prompt && prompt.id) {
      router.push(`/prompt/${prompt.id}`);
    }
  };

  // Get the first image URL
  const imageUrl = prompt?.media && prompt.media[0] ? prompt.media[0] : null;
  

  return (
    <div onClick={handleClick} className="cursor-pointer group">
      <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 aspect-square">
        {imageUrl && !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl.url} 
            alt={prompt.title || 'Prompt image'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={() => {
              console.log('Image failed to load:', imageUrl.url);
              setImageError(true);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <span className="text-gray-400 dark:text-gray-500 text-xs text-center px-2">
              {imageError ? 'Failed to load' : 'No image'}
            </span>
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white text-sm font-medium px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
            View Details →
          </span>
        </div>
      </div>
      
      {/* Title */}
      <div className="mt-2 text-center">
        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 px-1">
          {prompt.title || `Prompt #${prompt.id}`}
        </p>
      </div>
    </div>
  );
}