'use client';

import React, { useState, useEffect } from 'react';
import { db, collection, query, orderBy, limit, onSnapshot } from '@/lib/firebase';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function Stories() {
  const { user } = useAuth();
  const [stories, setStories] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setStories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 mb-6 no-scrollbar">
      {/* My Story */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <div className="relative w-16 h-16 rounded-full p-[2px] border-2 border-gray-200">
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <Image 
              src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/200`} 
              alt="My story" 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 border-2 border-white">
            <Plus className="w-3 h-3" />
          </div>
        </div>
        <span className="text-xs text-gray-500">Your story</span>
      </div>

      {stories.map((story) => (
        <div key={story.id} className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white">
              <Image 
                src={story.userPhotoURL || `https://picsum.photos/seed/${story.userId}/200`} 
                alt={story.username} 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <span className="text-xs text-gray-500 truncate w-16 text-center">{story.username}</span>
        </div>
      ))}
    </div>
  );
}
