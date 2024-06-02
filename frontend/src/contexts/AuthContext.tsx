import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import ArchistockApiService from '../services/ArchistockApiService';
import { redirect } from "react-router-dom";
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

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    // Check if accessToken is present in local storage
    if (accessToken) {
      archistockApiService.getUserByToken(accessToken).then((response) => {
        console.log(accessToken);
        console.log(response);
        if (response && response.email) {
          console.log('accessToken valid');
          console.log(response);
          setUser(response);
          setLoggedIn(true);
        } else {
          console.log('accessToken expired');
          // accessToken expired
          if (refreshToken) {
            console.log('refreshToken present');
            archistockApiService.getNewAccessToken(refreshToken).then((response) => {
              // if new accessToken is received
              localStorage.setItem('accessToken', response.accessToken);
              localStorage.setItem('refreshToken', response.refreshToken);

              if (response.accessToken) {
                archistockApiService.getUserByToken(response.accessToken).then((response) => {
                  if (response) {
                    setUser(response);
                    setLoggedIn(true);
                  }
                });
              }
            });
          }
        }
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, user, setLoggedIn, setUser, handleLogout }}>
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
