'use client';

import React, { useState } from 'react';
import { db, collection, addDoc, serverTimestamp } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function CreatePost() {
  const { user, profile } = useAuth();
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !imageUrl) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'posts'), {
        userId: user.uid,
        username: profile?.username || user.displayName || 'user',
        userPhotoURL: user.photoURL,
        imageUrl,
        caption,
        likesCount: 0,
        commentsCount: 0,
        createdAt: serverTimestamp(),
      });
      router.push('/');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-lg overflow-hidden mt-10">
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <h2 className="font-semibold">Create new post</h2>
        <button onClick={() => router.back()} className="text-gray-500">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <div className="flex gap-2">
            <input 
              type="url" 
              placeholder="Paste image URL here..." 
              className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
          </div>
          <p className="text-xs text-gray-400">Tip: Use picsum.photos for random images (e.g., https://picsum.photos/seed/any/800/800)</p>
        </div>

        {imageUrl && (
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
            <Image 
              src={imageUrl} 
              alt="Preview" 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Caption</label>
          <textarea 
            placeholder="Write a caption..." 
            className="w-full border border-gray-300 rounded-md p-2 text-sm h-24 resize-none focus:ring-blue-500 focus:border-blue-500"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !imageUrl}
          className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Sharing...' : 'Share'}
        </button>
      </form>
    </div>
  );
}
