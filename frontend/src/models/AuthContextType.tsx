import User  from "./User";

interface AuthContextType {
    loggedIn: boolean;
    user: User | null;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    handleLogout: () => void;
}

export default AuthContextType;