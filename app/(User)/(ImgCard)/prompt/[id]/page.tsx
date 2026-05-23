'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Loader2, 
  ArrowLeft, 
  Copy, 
  Check, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PromptDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const [prompt, setPrompt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchPrompt = async () => {
      setLoading(true);
      setError(null);
      try {
        const id = params?.id;
        if (!id) throw new Error("No ID found in URL");

        const res = await fetch(`/api/prompts/${id}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Error: ${res.status}`);
        }
        const result = await res.json();
        if (result.success) setPrompt(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPrompt();
  }, [params?.id]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % (prompt?.media?.length || 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + (prompt?.media?.length || 1)) % (prompt?.media?.length || 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Loader2 className="animate-spin text-black dark:text-white" size={40} />
      </div>
    );
  }

  if (error || !prompt) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black p-4 text-center">
        <h2 className="text-2xl font-bold dark:text-white mb-2">Oops!</h2>
        <p className="text-gray-500 mb-6">{error || "Prompt not found"}</p>
        <button 
          onClick={() => router.back()}
          className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full transition-transform active:scale-95"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pb-20">
      {/* Floating Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <span className="font-medium opacity-70">Prompt Details</span>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        
        {/* 1. Image Gallery Section */}
        <section className="relative group">
          <div className="relative aspect-square md:aspect-video overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <motion.img 
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={prompt.media?.[currentImageIndex] || '/placeholder.jpg'} 
              alt="AI Generated Result"
              className="w-full h-full object-contain"
            />
            
            {/* Navigation Arrows */}
            {prompt.media?.length > 1 && (
              <>
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-black/90 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 dark:bg-black/90 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            {prompt.media?.map((img: string, idx: number) => (
              <button 
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                  currentImageIndex === idx ? 'border-black dark:border-white scale-105' : 'border-transparent opacity-60'
                }`}
              >
                <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
              </button>
            ))}
          </div>
        </section>

        {/* 2. Title & Description Section */}
        <section className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            {prompt.title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
            {prompt.description}
          </p>
        </section>

        {/* 3. Prompt Copy Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider opacity-50 flex items-center gap-2">
              <Sparkles size={16} /> The Prompt
            </h3>
            <button 
              onClick={() => handleCopy(prompt.content)}
              className="flex items-center gap-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Prompt'}
            </button>
          </div>
          
          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 relative group">
            <p className="text-lg leading-relaxed whitespace-pre-wrap italic">
              "{prompt.content}"
            </p>
          </div>
        </section>

        {/* 4. Action Buttons Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nano Banana / Gemini Link */}
          <motion.a 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="https://gemini.google.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 p-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-3xl font-bold text-lg shadow-lg shadow-blue-500/20"
          >
            <Sparkles size={24} />
            Open in Gemini (Nano Banana)
            <ExternalLink size={20} className="opacity-70" />
          </motion.a>

          {/* Source Link if available */}
          {prompt.sourceLink ? (
            <motion.a 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={prompt.sourceLink} 
              target="_blank" 
              className="flex items-center justify-center gap-3 p-5 bg-gray-100 dark:bg-gray-800 rounded-3xl font-bold text-lg transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              View Original Source
              <ExternalLink size={20} className="opacity-50" />
            </motion.a>
          ) : (
            <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-400 italic">
              No source link available
            </div>
          )}
        </section>
      </div>
    </div>
  );
}