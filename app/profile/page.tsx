'use client';

import { useAuth } from '@/hooks/use-auth';
import { Navbar } from '@/components/navbar';
import { Login } from '@/components/login';
import { db, collection, query, where, onSnapshot, orderBy } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Settings, Grid, Bookmark, User as UserIcon } from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, loading } = useAuth();
  const [userPosts, setUserPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'posts'), 
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUserPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) return null;
  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 flex">
      <Navbar />
      
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto pt-8 px-4">
          {/* Profile Header */}
          <header className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-10 border-b border-gray-200">
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border border-gray-200">
              <Image 
                src={profile?.photoURL || user.photoURL || `https://picsum.photos/seed/${user.uid}/200`} 
                alt="Profile" 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <h1 className="text-xl font-light">{profile?.username || 'user'}</h1>
                <button className="bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">
                  Edit Profile
                </button>
                <Settings className="w-6 h-6 cursor-pointer" />
              </div>
              
              <div className="flex justify-center md:justify-start gap-8">
                <div><span className="font-semibold">{userPosts.length}</span> posts</div>
                <div><span className="font-semibold">0</span> followers</div>
                <div><span className="font-semibold">0</span> following</div>
              </div>
              
              <div>
                <p className="font-semibold">{profile?.displayName || user.displayName}</p>
                <p className="text-sm whitespace-pre-wrap">{profile?.bio || 'No bio yet.'}</p>
              </div>
            </div>
          </header>

          {/* Tabs */}
          <div className="flex justify-center gap-12 border-t border-gray-200 md:border-none mb-4">
            <div className="flex items-center gap-2 py-4 border-t-2 border-black -mt-[2px] cursor-pointer">
              <Grid className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-widest">Posts</span>
            </div>
            <div className="flex items-center gap-2 py-4 text-gray-400 cursor-pointer">
              <Bookmark className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-widest">Saved</span>
            </div>
            <div className="flex items-center gap-2 py-4 text-gray-400 cursor-pointer">
              <UserIcon className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-widest">Tagged</span>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 gap-1 md:gap-8">
            {userPosts.map((post) => (
              <div key={post.id} className="relative aspect-square bg-gray-100 group cursor-pointer">
                <Image 
                  src={post.imageUrl} 
                  alt="Post" 
                  fill 
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
                  <div className="flex items-center gap-1">
                    <Grid className="w-5 h-5 fill-current" />
                    {post.likesCount}
                  </div>
                  <div className="flex items-center gap-1">
                    <Grid className="w-5 h-5 fill-current" />
                    {post.commentsCount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
