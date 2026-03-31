'use client';

import { useAuth } from '@/hooks/use-auth';
import { Navbar } from '@/components/navbar';
import { Stories } from '@/components/stories';
import { Post } from '@/components/post';
import { Login } from '@/components/login';
import { db, collection, query, orderBy, limit, onSnapshot } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { Instagram, Loader2 } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setPostsLoading(false);
    }, (error) => {
      console.error('Error fetching posts:', error);
      setPostsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Instagram className="w-12 h-12 text-gray-300 animate-pulse" />
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 flex">
      <Navbar />
      
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        <div className="max-w-xl mx-auto pt-8 px-4">
          <Stories />
          
          <div className="space-y-6">
            {postsLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <Post key={post.id} post={post} />
              ))
            ) : (
              <div className="text-center py-20 bg-white border border-gray-200 rounded-lg">
                <p className="text-gray-500">No posts yet. Be the first to share!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Right Sidebar (Desktop) */}
      <aside className="hidden lg:block w-80 p-8 sticky top-0 h-screen">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 relative">
            <Image 
              src={user.photoURL || `https://picsum.photos/seed/${user.uid}/200`} 
              alt="Profile" 
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <p className="font-semibold text-sm">{user.displayName || 'User'}</p>
            <p className="text-gray-500 text-xs">{user.email}</p>
          </div>
        </div>
        
        <div className="text-xs text-gray-400 mt-10">
          © 2026 INSTACLONE FROM AI STUDIO
        </div>
      </aside>
    </div>
  );
}
