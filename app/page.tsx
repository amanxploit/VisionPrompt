'use client';

import { useState, useEffect } from 'react';
import { SplashScreen } from './components/splash-screen';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();


  useEffect(() => {
    // Check if splash screen has been shown before in this session
    const splashShown = sessionStorage.getItem('splashShown');
    if (splashShown) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('splashShown', 'true');
    setShowSplash(false);
  };


  const handleGetStarted = () => {
    router.push('/home');
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      {!showSplash && (
        <main className="min-h-screen bg-white dark:bg-black">
          <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="mb-8"
              >
                <svg 
                  width="100" 
                  height="100" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="text-black dark:text-white"
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-black dark:text-white mb-4">
                VisionPrompt
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
                Transform your ideas into stunning visuals with AI
              </p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => {handleGetStarted()}} className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                    Get Started
                  </button>
                  {/* <button className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-black dark:text-white rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    Learn More
                  </button> */}
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-8">
                  Coming soon: AI-powered image generation from text prompts
                </p>
              </motion.div>
            </motion.div>
          </div>
        </main>
      )}
    </>
  );
}