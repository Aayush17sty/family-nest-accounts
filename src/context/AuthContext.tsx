
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, Account } from "../types";

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration - would be replaced with API calls
  const mockParentUser: User = {
    id: "1",
    username: "parent",
    email: "parent@example.com",
    role: "parent",
  };

  const mockChildUser: User = {
    id: "2",
    username: "child",
    email: "child@example.com",
    role: "child",
  };

  const mockAccounts: Account[] = [
    {
      id: "1",
      name: "Parent Savings",
      balance: 5000,
      userId: "1",
      isParentAccount: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Child Allowance",
      balance: 100,
      userId: "2",
      parentId: "1",
      isParentAccount: false,
      createdAt: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Simulate fetching accounts
      setTimeout(() => {
        if (parsedUser.role === "parent") {
          setAccounts(mockAccounts);
          setSelectedAccount(mockAccounts[0]);
        } else {
          const childAccount = mockAccounts.find(
            (acc) => acc.userId === parsedUser.id
          );
          setAccounts(childAccount ? [childAccount] : []);
          setSelectedAccount(childAccount || null);
        }
        setIsLoading(false);
      }, 500);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let mockUser;
    if (username === "parent") {
      mockUser = mockParentUser;
      localStorage.setItem("user", JSON.stringify(mockParentUser));
      setUser(mockParentUser);
      setAccounts(mockAccounts);
      setSelectedAccount(mockAccounts[0]);
    } else if (username === "child") {
      mockUser = mockChildUser;
      localStorage.setItem("user", JSON.stringify(mockChildUser));
      setUser(mockChildUser);
      const childAccount = mockAccounts.find(
        (acc) => acc.userId === mockChildUser.id
      );
      setAccounts(childAccount ? [childAccount] : []);
      setSelectedAccount(childAccount || null);
    } else {
      throw new Error("Invalid credentials");
    }

    setIsLoading(false);
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    role: "parent" | "child",
    parentId?: string
  ) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // This would normally be handled by the backend
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      email,
      role,
    };

    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    
    // Create a default account for the new user
    const newAccount: Account = {
      id: Math.random().toString(36).substr(2, 9),
      name: role === "parent" ? "Main Account" : "Allowance Account",
      balance: 0,
      userId: newUser.id,
      parentId: role === "child" ? parentId : undefined,
      isParentAccount: role === "parent",
      createdAt: new Date().toISOString(),
    };
    
    setAccounts([newAccount]);
    setSelectedAccount(newAccount);
    setIsLoading(false);
  };

  const logout = () => {
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
