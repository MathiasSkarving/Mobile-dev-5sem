import { createContext, useContext, useState, ReactNode } from 'react';

type AuthContextType = {
  isLoggedIn: boolean;
  isVerified: boolean;
  logIn: () => void;
  logOut: () => void;
  verify: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isVerified,
        logIn: () => setIsLoggedIn(true),
        // Verification belongs to the account, so it is cleared on logout
        logOut: () => {
          setIsLoggedIn(false);
          setIsVerified(false);
        },
        verify: () => setIsVerified(true),
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
