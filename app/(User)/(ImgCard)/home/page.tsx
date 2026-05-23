'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, ArrowUpDown, LayoutGrid, Zap, Video, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PromptCardSimple } from '../../../components/Home/prompt-card';
import { BottomNav } from '../../../components/Home/bottom-nav';

const MODELS = [
  { id: '', name: 'All', icon: <LayoutGrid size={14} /> },
  { id: 'nanobanana', name: 'Nano Banana', icon: <Zap size={14} /> },
  { id: 'gptimage', name: 'GPT Image', icon: <Sparkles size={14} /> },
  { id: 'midjourney', name: 'Midjourney', icon: <Zap size={14} /> },
  { id: 'seedance', name: 'Seedance', icon: <Video size={14} /> },
];

const SORTS = [
  { id: 'featured', name: 'Featured' },
  { id: 'latest', name: 'Latest' },
  { id: 'likes', name: 'Most Liked' },
];

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeModel, setActiveModel] = useState('');
  const [activeSort, setActiveSort] = useState('featured');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // GUARD: prevents multiple requests for the same page
  const fetchingPageRef = useRef<number | null>(null);

  const loadPrompts = useCallback(async (pageNum: number, model: string, sort: string) => {
    // If we are already fetching this specific page, stop.
    if (fetchingPageRef.current === pageNum) return;
    
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    fetchingPageRef.current = pageNum; // Mark this page as "fetching"

    try {
      const res = await fetch(`/api/prompts?page=${pageNum}&limit=20&model=${model}&sort=${sort}`);
      const result = await res.json();
      
      if (result.success) {
        setPrompts(prev => pageNum === 1 ? result.data : [...prev, ...result.data]);
        setHasMore(result.pagination.hasNext);
      }
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      fetchingPageRef.current = null; // Clear the guard
    }
  }, []);

  // Reset and load when filters change
  useEffect(() => {
    setPage(1);
    loadPrompts(1, activeModel, activeSort);
  }, [activeModel, activeSort, loadPrompts]);

  // Load next page when page state updates
  useEffect(() => {
    if (page > 1) {
      loadPrompts(page, activeModel, activeSort);
    }
  }, [page, loadPrompts, activeModel, activeSort]);

  const observerRef = useRef<IntersectionObserver>();
  const lastElementRef = useCallback((node: HTMLDivElement) => {
    if (loading || loadingMore) return; // STOP if any loading is happening
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    }, { threshold: 0.1 }); // Only trigger when 10% of the element is visible
    
    if (node) observerRef.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black text-zinc-900 dark:text-zinc-100 pb-24">
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-4 py-4">
        <div className="max-w-5xl mx-auto space-y-5">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold italic tracking-tighter">VPGallery</h1>
            <div className="relative flex items-center gap-2 text-sm font-medium">
              <ArrowUpDown size={14} className="text-zinc-400" />
              <select 
                value={activeSort} 
                onChange={(e) => setActiveSort(e.target.value)}
                className="bg-transparent outline-none cursor-pointer"
              >
                {SORTS.map(s => <option key={s.id} value={s.id} className="dark:bg-black">{s.name}</option>)}
              </select>
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveModel(m.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                  activeModel === m.id ? 'text-white' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400'
                }`}
              >
                {activeModel === m.id && (
                  <motion.div layoutId="activeTab" className="absolute inset-0 bg-zinc-900 dark:bg-zinc-100 rounded-full -z-10" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                )}
                {m.icon} {m.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {loading && prompts.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="aspect-[4/5] bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-3xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {prompts.map((p, i) => (
              <div key={`${p.id}-${i}`} ref={i === prompts.length - 1 ? lastElementRef : null}>
                <PromptCardSimple prompt={p} index={i} />
              </div>
            ))}
          </div>
        )}
        {loadingMore && <div className="flex justify-center py-10"><Loader2 className="animate-spin text-zinc-400" /></div>}
      </main>
      <BottomNav />
    </div>
  );
}