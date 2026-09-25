import { createContext, useContext, useState, ReactNode } from 'react';

type AuthContextType = {
  isLoggedIn: boolean;
  logIn: () => void;
  logOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        logIn: () => setIsLoggedIn(true),
        logOut: () => setIsLoggedIn(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth skal bruges inde i en AuthProvider');
  return context;
}