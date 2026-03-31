'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Search, PlusSquare, Heart, User, LogOut, Instagram } from 'lucide-react';
import { signOut, auth } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { user, profile } = useAuth();

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Search, label: 'Search', href: '/search' },
    { icon: PlusSquare, label: 'Create', href: '/create' },
    { icon: Heart, label: 'Notifications', href: '/notifications' },
    { icon: User, label: 'Profile', href: `/${profile?.username || 'profile'}` },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 border-r border-gray-200 p-4 bg-white z-50">
        <Link href="/" className="mb-10 px-3">
          <Instagram className="w-8 h-8 mb-2" />
          <h1 className="text-xl font-bold font-serif italic">InstaClone</h1>
        </Link>

        <div className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-4 p-3 hover:bg-gray-100 rounded-lg transition-colors group"
            >
              <item.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-lg">{item.label}</span>
            </Link>
          ))}
        </div>

        <button
          onClick={() => signOut(auth)}
          className="flex items-center gap-4 p-3 hover:bg-red-50 text-red-600 rounded-lg transition-colors mt-auto"
        >
          <LogOut className="w-6 h-6" />
          <span className="text-lg">Logout</span>
        </button>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 flex items-center justify-around px-4 z-50">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} className="p-2">
            <item.icon className="w-6 h-6" />
          </Link>
        ))}
      </nav>
    </>
  );
}
