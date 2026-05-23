'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usePromptStore } from '@/store/usePromptStore';

interface PromptCardSimpleProps {
  prompt: any;
  index: number;
}

export function PromptCardSimple({ prompt, index }: PromptCardSimpleProps) {
  const router = useRouter();
  const setSelectedPrompt = usePromptStore((state) => state.setSelectedPrompt); // Get the setter
  const [mediaError, setMediaError] = useState(false);

  const handleClick = () => {
    if (prompt && prompt.id) {
      setSelectedPrompt(prompt); // <--- SAVE ALL DATA HERE
      router.push(`/home/${prompt.id}`);
    }
  };


  // Get the first media object
  const mediaItem = prompt?.media && prompt.media[0] ? prompt.media[0] : null;
  const mediaUrl = mediaItem?.url;

  // Helper to check if the URL is a video
  const isVideo = (url: string | null) => {
    if (!url) return false;
    return /\.(mp4|webm|ogg|mov)$/i.test(url);
  };

  const hasVideo = isVideo(mediaUrl);

  const getProxiedUrl = (url: string) => {
  if (!url) return '';
  // This wraps your URL inside the weserv.nl proxy
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
};


  return (
    <div onClick={handleClick} className="cursor-pointer group">
      <div className="relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 aspect-square">
        {mediaUrl && !mediaError ? (
          hasVideo ? (
            <video
              src={getProxiedUrl(mediaUrl)}
              muted
              loop
              referrerPolicy="no-referrer"
              playsInline
              autoPlay
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => {
                console.log('Video failed to load:', mediaUrl);
                setMediaError(true);
              }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
            
              src={getProxiedUrl(mediaUrl)}
              alt={prompt.title || 'Prompt image'}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => {
                console.log('Image failed to load:', mediaUrl);
                setMediaError(true);
              }}
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <span className="text-gray-400 dark:text-gray-500 text-xs text-center px-2">
              {mediaError ? 'Failed to load' : 'No media'}
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