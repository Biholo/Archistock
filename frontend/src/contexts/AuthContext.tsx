import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import ArchistockApiService from "../services/ArchistockApiService";
import User from "../models/UserModel";
import AuthContextType from "../models/AuthContextTypeModel";

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
    const accessToken = getCookie("accessToken");
    const refreshToken = getCookie("refreshToken");

    if (accessToken) {
      archistockApiService.getUserByToken(accessToken).then((response) => {
        if (response && response.email) {
          setUser(response);
          setLoggedIn(true);
        } else if (refreshToken) {
          archistockApiService
            .getNewAccessToken(refreshToken)
            .then((response) => {
              setCookie("accessToken", response.accessToken, 1);
              setCookie("refreshToken", response.refreshToken, 1);

              if (response.accessToken) {
                archistockApiService
                  .getUserByToken(response.accessToken)
                  .then((response) => {
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
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    setUser(null);
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ loggedIn, user, setLoggedIn, setUser, handleLogout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const setCookie = (name: string, value: string, days: number) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
};

export const getCookie = (name: string) => {
  const cookieName = name + "=";
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return "";
};

export const deleteCookie = (name: string) => {
  document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
