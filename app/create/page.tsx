'use client';

import { Navbar } from '@/components/navbar';
import { CreatePost } from '@/components/create-post';
import { useAuth } from '@/hooks/use-auth';
import { Login } from '@/components/login';

export default function CreatePage() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navbar />
      <main className="flex-1 md:ml-64 p-4">
        <CreatePost />
      </main>
    </div>
  );
}
