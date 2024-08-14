import React, { useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface AuthProviderProps {
    children: ReactNode;
  }
  
export const AuthWrapper:  React.FC<AuthProviderProps> = ({ children }) => {
    const { loggedIn } = useAuth();
    const navigate = useNavigate();
  
    useEffect(() => {
      if (loggedIn) {
        navigate('/storage');
      }
    }, [loggedIn, navigate]);
  
    return <>{children}</>;
  };

