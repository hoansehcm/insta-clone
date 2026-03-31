'use client';

import { Navbar } from '@/components/navbar';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white md:bg-gray-50 flex">
      <Navbar />
      <main className="flex-1 md:ml-64 p-8">
        <div className="max-w-xl mx-auto">
          <div className="relative mb-8">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-gray-100 border-none rounded-lg py-2 pl-10 pr-4 focus:ring-0"
            />
          </div>
          <div className="grid grid-cols-3 gap-1">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-sm" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
