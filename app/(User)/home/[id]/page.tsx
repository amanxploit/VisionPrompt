'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BottomNav } from '../../../components/Home/bottom-nav';
import { Heart, Copy, Check, ExternalLink, Calendar, User, Languages, ArrowLeft } from 'lucide-react';
import Image from 'next/image';


export default function PromptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchPrompt();
  }, [params.id]);

  const fetchPrompt = async () => {
    try {
      const response = await fetch(`/api/prompts/${params.id}`);
      const result = await response.json();
      if (result.success) {
        setPrompt(result.data);
      }
    } catch (error) {
      console.error('Error fetching prompt:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black dark:text-white">Prompt not found</h2>
          <button onClick={() => router.back()} className="mt-4 text-blue-500">Go back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Image Gallery */}
        {prompt.media && prompt.media.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {prompt.media.map((img: string, index: number) => (
              <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img src={img} alt={`${prompt.title} - ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Title and Actions */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">{prompt.title}</h1>
            {prompt.featured && (
              <span className="inline-block text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                Featured
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setLiked(!liked)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Heart size={24} className={liked ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'} />
            </button>
            <button
              onClick={() => handleCopy(prompt.content)}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {copied ? <Check size={24} className="text-green-500" /> : <Copy size={24} />}
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          {prompt.description}
        </p>

        {/* Original Prompt */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-3">Original Prompt</h2>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{prompt.content}</p>
          </div>
        </div>

        {/* Translated Content */}
        {prompt.translatedContent && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Languages size={20} />
              <h2 className="text-xl font-semibold text-black dark:text-white">English Translation</h2>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{prompt.translatedContent}</p>
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 space-y-3">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-3">Information</h3>
          
          {prompt.author && (
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <User size={18} />
              <span>Author: {prompt.author.name}</span>
              {prompt.author.link && (
                <a href={prompt.author.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  View Profile
                </a>
              )}
            </div>
          )}
          
          {prompt.sourcePublishedAt && (
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <Calendar size={18} />
              <span>Published: {new Date(prompt.sourcePublishedAt).toLocaleDateString()}</span>
            </div>
          )}
          
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
            <Languages size={18} />
            <span>Language: {prompt.language?.toUpperCase()}</span>
          </div>
          
          {prompt.resultsCount > 0 && (
            <div className="text-green-600 dark:text-green-400">
              ✓ {prompt.resultsCount} generation results available
            </div>
          )}
          
          {prompt.needReferenceImages && (
            <div className="text-blue-600 dark:text-blue-400">
              ℹ️ Reference images recommended for best results
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => handleCopy(prompt.content)}
            className="flex-1 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Copy Prompt to Clipboard
          </button>
          
          {prompt.sourceLink && (
            <a
              href={prompt.sourceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              View Source <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}