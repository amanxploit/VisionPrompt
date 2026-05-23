'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Search, Plus, Bookmark, TrendingUp } from 'lucide-react';

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/home' },
    // { id: 'search', label: 'Search', icon: Search, path: '/search' },
    { id: 'add', label: 'Add', icon: Plus, path: '/create' },
    { id: 'save', label: 'Save', icon: Bookmark, path: '/saved' },
    { id: 'trending', label: 'Trend', icon: TrendingUp, path: '/trending' },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pointer-events-auto relative flex items-center justify-around bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 px-3 py-3 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        style={{ width: 'fit-content', minWidth: '320px' }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`relative flex items-center justify-center px-5 py-3 rounded-full transition-colors duration-300 group ${
                isActive ? 'text-black dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
            >
              {/* The Active Background Pill */}
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-black dark:bg-white rounded-full"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Icon & Label Wrapper */}
              <motion.div 
                className={`relative z-10 flex items-center gap-2 ${isActive ? 'scale-110' : 'scale-100'}`}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-white' : 'text-gray-400 dark:text-gray-200'} />
                {isActive && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs font-bold uppercase tracking-wider text-white dark:text-white"
                  >
                    {item.label}
                  </motion.span>
                )}
              </motion.div>

              {/* Hover Tooltip for non-active items */}
              {!isActive && (
                <span className="absolute -top-10 scale-0 group-hover:scale-100 transition-all bg-gray-900 dark:bg-white text-white dark:text-black text-[10px] px-2 py-1 rounded font-bold uppercase tracking-tighter pointer-events-none">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </motion.nav>
    </div>
  );
}