import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type UserRole = "admin" | "faculty" | "student";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    email: string,
    password: string,
    name: string,
    role: UserRole,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("educrm_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("educrm_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Mock authentication - in real app, this would call Supabase or your backend
      const mockUsers: User[] = [
        {
          id: "1",
          email: "admin@educrm.com",
          name: "Admin User",
          role: "admin",
        },
        {
          id: "2",
          email: "faculty@educrm.com",
          name: "Faculty User",
          role: "faculty",
        },
        {
          id: "3",
          email: "student@educrm.com",
          name: "Student User",
          role: "student",
        },
      ];

      const foundUser = mockUsers.find((u) => u.email === email);
      if (foundUser && password === "password") {
        // Simple mock password
        setUser(foundUser);
        localStorage.setItem("educrm_user", JSON.stringify(foundUser));
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: "Invalid email or password" };
      }
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: "Login failed" };
    }
  };

  const signup = async (
    email: string,
    _password: string,
    name: string,
    role: UserRole,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Mock signup - in real app, create user in Supabase
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role,
      };
      setUser(newUser);
      localStorage.setItem("educrm_user", JSON.stringify(newUser));
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: "Signup failed" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("educrm_user");
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
