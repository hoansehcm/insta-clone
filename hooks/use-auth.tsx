'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, onAuthStateChanged, doc, getDoc, setDoc, serverTimestamp, FirebaseUser } from '@/lib/firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Check if profile exists, if not create it
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          const newProfile = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0],
            photoURL: user.photoURL || `https://picsum.photos/seed/${user.uid}/200`,
            username: user.email?.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'user_' + user.uid.slice(0, 5),
            bio: '',
            createdAt: serverTimestamp(),
          };
          await setDoc(doc(db, 'users', user.uid), newProfile);
          setProfile(newProfile);
        } else {
          setProfile(userDoc.data());
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
