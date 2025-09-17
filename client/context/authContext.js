import { createContext, useState, useEffect, useContext } from "react";
import AuthService from "@/services/auth.service";
import { useRouter } from "next/router";

// Create Auth Context
const AuthContext = createContext({
  currentUser: null,
  login: async () => {},
  logout: () => {},
});

// Create Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    const data = await AuthService.login(username, password);
    setCurrentUser(data.user);
    return data;
  };

  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
    router.push("/login");
  };

  const value = { currentUser, login, logout };

  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
