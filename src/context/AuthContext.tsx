
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, Account } from "../types";
import axios from "axios";

interface AuthContextType {
  user: User | null;
  accounts: Account[];
  selectedAccount: Account | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    username: string,
    email: string,
    password: string,
    role: "parent" | "child",
    parentId?: string
  ) => Promise<void>;
  selectAccount: (accountId: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Axios interceptor to add JWT to each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in by checking for token
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Fetch accounts for the logged in user
      fetchUserAccounts(parsedUser.id);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserAccounts = async (userId: string) => {
    try {
      const { data } = await api.get(`/accounts/user/${userId}`);
      setAccounts(data);
      
      if (data.length > 0) {
        setSelectedAccount(data[0]);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/login", { username, password });
      
      // Convert backend user to frontend model
      const loggedInUser: User = {
        id: data.user.id.toString(),
        username: data.user.username,
        email: data.user.email,
        role: data.user.role.toLowerCase(),
      };

      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      
      setUser(loggedInUser);
      
      // Fetch user accounts
      await fetchUserAccounts(loggedInUser.id);
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    role: "parent" | "child",
    parentId?: string
  ) => {
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        username,
        email,
        password,
        role: role.toUpperCase(),
        parentId: parentId ? parseInt(parentId) : null,
      });

      // Auto login after registration
      await login(username, password);
      
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setAccounts([]);
    setSelectedAccount(null);
  };

  const selectAccount = (accountId: string) => {
    const account = accounts.find((acc) => acc.id === accountId);
    if (account) {
      setSelectedAccount(account);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accounts,
        selectedAccount,
        login,
        logout,
        register,
        selectAccount,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
