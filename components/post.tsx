'use client';

import React, { useState, useEffect } from 'react';
import { db, collection, query, orderBy, limit, onSnapshot, doc, updateDoc, increment, deleteDoc, setDoc, Timestamp } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface PostProps {
  post: any;
}

export function Post({ post }: PostProps) {
  const { user, profile } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (!user) return;
    
    // Check if user liked the post
    const likeRef = doc(db, 'posts', post.id, 'likes', user.uid);
    const unsubscribe = onSnapshot(likeRef, (doc) => {
      setIsLiked(doc.exists());
    });

    return () => unsubscribe();
  }, [post.id, user]);

  useEffect(() => {
    if (!showComments) return;
    
    const commentsRef = collection(db, 'posts', post.id, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [post.id, showComments]);

  const handleLike = async () => {
    if (!user) return;
    
    const likeRef = doc(db, 'posts', post.id, 'likes', user.uid);
    const postRef = doc(db, 'posts', post.id);

    if (isLiked) {
      await deleteDoc(likeRef);
      await updateDoc(postRef, { likesCount: increment(-1) });
      setLikesCount((prev: number) => prev - 1);
    } else {
      await setDoc(likeRef, { userId: user.uid, createdAt: Timestamp.now() });
      await updateDoc(postRef, { likesCount: increment(1) });
      setLikesCount((prev: number) => prev + 1);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    const commentData = {
      postId: post.id,
      userId: user.uid,
      username: profile?.username || user.displayName || 'user',
      text: newComment,
      createdAt: Timestamp.now(),
    };

    await setDoc(doc(collection(db, 'posts', post.id, 'comments')), commentData);
    await updateDoc(doc(db, 'posts', post.id), { commentsCount: increment(1) });
    setNewComment('');
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deleteDoc(doc(db, 'posts', post.id));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-lg mb-6 max-w-lg mx-auto overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
            <Image 
              src={post.userPhotoURL || `https://picsum.photos/seed/${post.userId}/200`} 
              alt={post.username} 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-semibold text-sm">{post.username}</span>
        </div>
        {user?.uid === post.userId && (
          <button onClick={handleDeletePost} className="text-gray-500 hover:text-red-500">
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Image */}
      <div className="relative aspect-square bg-gray-100">
        <Image 
          src={post.imageUrl} 
          alt="Post content" 
          fill 
          className="object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className={cn("transition-transform active:scale-125", isLiked ? "text-red-500" : "text-gray-700")}>
              <Heart className={cn("w-6 h-6", isLiked && "fill-current")} />
            </button>
            <button onClick={() => setShowComments(!showComments)} className="text-gray-700">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="text-gray-700">
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button className="text-gray-700">
            <Bookmark className="w-6 h-6" />
          </button>
        </div>

        <div className="font-semibold text-sm mb-1">{likesCount} likes</div>
        
        <div className="text-sm">
          <span className="font-semibold mr-2">{post.username}</span>
          {post.caption}
        </div>

        {post.commentsCount > 0 && !showComments && (
          <button 
            onClick={() => setShowComments(true)}
            className="text-gray-500 text-sm mt-1"
          >
            View all {post.commentsCount} comments
          </button>
        )}

        <div className="text-xs text-gray-400 uppercase mt-2">
          {post.createdAt?.toDate ? formatDistanceToNow(post.createdAt.toDate()) : 'just now'} ago
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 border-t border-gray-100 pt-3 space-y-2"
            >
              {comments.map((comment) => (
                <div key={comment.id} className="text-sm">
                  <span className="font-semibold mr-2">{comment.username}</span>
                  {comment.text}
                </div>
              ))}
              
              <form onSubmit={handleAddComment} className="flex items-center gap-2 mt-3">
                <input 
                  type="text" 
                  placeholder="Add a comment..." 
                  className="flex-1 text-sm border-none focus:ring-0 p-0"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button 
                  type="submit" 
                  disabled={!newComment.trim()}
                  className="text-blue-500 font-semibold text-sm disabled:opacity-50"
                >
                  Post
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
