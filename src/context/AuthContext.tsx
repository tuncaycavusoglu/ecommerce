import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from '../services/firebase';
import { syncUser, fetchCurrentUser } from '../services/api';
import type { AppUser } from '../types';

interface AuthContextValue {
  firebaseUser: User | null;
  appUser: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        try {
          const userData = await fetchCurrentUser();
          setAppUser(userData);
        } catch {
          // Kullanıcı henüz sync edilmemiş olabilir
          try {
            const synced = await syncUser({
              email: user.email || '',
              displayName: user.displayName || '',
            });
            setAppUser(synced);
          } catch {
            setAppUser(null);
          }
        }
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const synced = await syncUser({
      email: cred.user.email || '',
      displayName: cred.user.displayName || '',
    });
    setAppUser(synced);
  };

  const register = async (email: string, password: string, displayName: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    const synced = await syncUser({ email, displayName });
    setAppUser(synced);
  };

  const logout = async () => {
    await signOut(auth);
    setAppUser(null);
  };

  const isAdmin = appUser?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ firebaseUser, appUser, loading, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
