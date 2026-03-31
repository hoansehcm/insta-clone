'use client';

import { Navbar } from '@/components/navbar';
import { Heart } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-white md:bg-gray-50 flex">
      <Navbar />
      <main className="flex-1 md:ml-64 p-8">
        <div className="max-w-xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Notifications</h1>
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">user_{i}</span> liked your photo.
                  </p>
                  <p className="text-xs text-gray-400">{i + 1}h ago</p>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-sm" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
