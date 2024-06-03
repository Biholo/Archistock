import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import ArchistockApiService from '../services/ArchistockApiService';
import User from "../models/User";
import AuthContextType from "../models/AuthContextType";

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the provider props type
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const archistockApiService = new ArchistockApiService();

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken) {
      archistockApiService.getUserByToken(accessToken).then((response) => {
        if (response && response.email) {
          setUser(response);
          setLoggedIn(true);
        } else if (refreshToken) {
          archistockApiService.getNewAccessToken(refreshToken).then((response) => {
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);

            if (response.accessToken) {
              archistockApiService.getUserByToken(response.accessToken).then((response) => {
                if (response) {
                  setUser(response);
                  setLoggedIn(true);
                }
                setLoading(false);
              });
            } else {
              setLoading(false);
            }
          });
        } else {
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) {
      setLoading(false);
    }
  }, [loggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, user, setLoggedIn, setUser, handleLogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
