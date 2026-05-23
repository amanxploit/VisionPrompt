'use client';

import { BottomNav } from "@/app/components/Home/bottom-nav";


export default function CreatePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black pb-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-black dark:text-white">Create</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Create new images...</p>
      </div>
      <BottomNav/>
    </div>
  );
}