import React, { createContext, useState, useContext, ReactNode } from 'react';

type AuthContextType = {
    isLoggedIn: boolean;
    username: string | null;
    profile: string | null;
    login: (username: string, profile: string) => void;
    logout: () => void;
  };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [profile, setProfile] = useState<string | null>(null);

  const login = (username: string, profile: string) => {
    setIsLoggedIn(true);
    setUsername(username);
    setProfile(profile);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, profile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
