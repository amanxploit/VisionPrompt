'use client';

import { useState, useEffect, useCallback } from 'react';
import { BottomNav } from '../../components/Home/bottom-nav';
import { Search, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Prompt {
  id: number;
  title: string;
  description: string;
  content: string;
  translatedContent?: string;
  media: string[];
  language: string;
  featured: boolean;
  likes: number;
  author: { name: string; link: string };
  sourceLink: string;
  sourcePublishedAt: string;
  resultsCount: number;
}

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    language: '',
    featured: false,
    sortBy: 'id',
    sortOrder: 'desc'
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
      setPrompts([]);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchPrompts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filters.language && { language: filters.language }),
        ...(filters.featured && { featured: 'true' }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });

      const response = await fetch(`/api/prompts?${params}`);
      const result = await response.json();

      if (result.success) {
        if (page === 1) {
          setPrompts(result.data);
        } else {
          setPrompts(prev => [...prev, ...result.data]);
        }
        setHasMore(result.pagination.hasNext);
        setTotal(result.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, filters]);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleLike = (id: number) => {
    setPrompts(prev => prev.map(prompt =>
      prompt.id === id ? { ...prompt, likes: (prompt.likes || 0) + 1 } : prompt
    ));
  };

  const resetFilters = () => {
    setFilters({
      language: '',
      featured: false,
      sortBy: 'id',
      sortOrder: 'desc'
    });
    setSearchTerm('');
    setPage(1);
    setPrompts([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-3">
            Image Prompts Library
          </h1>
          
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search prompts by title, description, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <Filter size={20} />
            </button>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 overflow-hidden"
              >
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="grid gap-3">
                    <select
                      value={filters.language}
                      onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                    >
                      <option value="">All Languages</option>
                      <option value="en">English</option>
                      <option value="zh">Chinese</option>
                    </select>
                    
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                    >
                      <option value="id">Sort by ID</option>
                      <option value="likes">Sort by Likes</option>
                      <option value="title">Sort by Title</option>
                    </select>
                    
                    <select
                      value={filters.sortOrder}
                      onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                    >
                      <option value="desc">Newest First</option>
                      <option value="asc">Oldest First</option>
                    </select>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.featured}
                        onChange={(e) => setFilters({ ...filters, featured: e.target.checked })}
                      />
                      <span>Show Featured Only</span>
                    </label>
                    
                    <button
                      onClick={resetFilters}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Count */}
          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Found {total} prompts
          </div>
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <InfiniteScroll
          dataLength={prompts.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          }
          endMessage={
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              You've seen all {total} prompts! 🎉
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt, index) => (
              <PromptCard key={`${prompt.id}-${index}`} prompt={prompt} onLike={handleLike} />
            ))}
          </div>
        </InfiniteScroll>

        {loading && prompts.length === 0 && (
          <div className="flex justify-center items-center h-64">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        )}

        {!loading && prompts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No prompts found. Try adjusting your search.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}