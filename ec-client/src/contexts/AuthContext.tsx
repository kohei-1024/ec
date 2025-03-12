import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN, REGISTER, UPDATE_USER } from '@/graphql/mutations/auth';
import { User, LoginInput, RegisterInput, AuthPayload } from '@/types/models';

// Mock users for development
const MOCK_USERS = [
  {
    id: 'user-1',
    email: 'user@example.com',
    password: 'password123', // this would be hashed in a real app
    firstName: 'John',
    lastName: 'Doe',
    role: 'CUSTOMER',
  },
  {
    id: 'user-2',
    email: 'admin@example.com',
    password: 'admin123', // this would be hashed in a real app
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
  },
];

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  updateUser: (input: any) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: async () => {},
  error: null,
  clearError: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Set initial mock user for easier testing
  const initialUser = useMemo(
    () =>
      ({
        id: 'user-1',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'CUSTOMER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }) as const,
    []
  );

  const [user, setUser] = useState<User | null>(initialUser);
  const [token, setToken] = useState<string | null>('mock-token-123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const [loginMutation] = useMutation(LOGIN);
  const [registerMutation] = useMutation(REGISTER);
  const [updateUserMutation] = useMutation(UPDATE_USER);

  useEffect(() => {
    // Store the mock user in localStorage for persistence
    localStorage.setItem('token', 'mock-token-123');
    localStorage.setItem('user', JSON.stringify(initialUser));

    // Check if we have a token in localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (err) {
        // Invalid stored user data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setIsLoading(false);
  }, [initialUser]);

  const clearError = () => {
    setError(null);
  };

  const login = async (input: LoginInput) => {
    try {
      setError(null);
      setIsLoading(true);

      if (process.env.NODE_ENV === 'development') {
        // For development, use mock authentication
        const mockUser = MOCK_USERS.find(
          user => user.email === input.email && user.password === input.password
        );

        if (!mockUser) {
          throw new Error('Invalid email or password');
        }

        // Create a copy without the password
        const { password, ...userWithoutPassword } = mockUser;

        // Set user and token
        setUser(userWithoutPassword as User);
        setToken('mock-token-123');
        setIsAuthenticated(true);

        // Store in localStorage
        localStorage.setItem('token', 'mock-token-123');
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        // For production, use the GraphQL mutation
        const { data } = await loginMutation({ variables: { input } });

        if (data?.login) {
          const { token, user } = data.login as AuthPayload;
          setToken(token);
          setUser(user);
          setIsAuthenticated(true);

          // Store in localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (input: RegisterInput) => {
    try {
      setError(null);
      setIsLoading(true);

      if (process.env.NODE_ENV === 'development') {
        // For development, mock registration
        // Check if email is already in use
        if (MOCK_USERS.some(user => user.email === input.email)) {
          throw new Error('Email is already in use');
        }

        // Create new mock user
        const newUser = {
          id: `user-${Date.now()}`,
          email: input.email,
          firstName: input.firstName,
          lastName: input.lastName,
          role: 'CUSTOMER',
        };

        // Set user and token
        setUser(newUser as User);
        setToken('mock-token-123');
        setIsAuthenticated(true);

        // Store in localStorage
        localStorage.setItem('token', 'mock-token-123');
        localStorage.setItem('user', JSON.stringify(newUser));

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        // For production, use the GraphQL mutation
        const { data } = await registerMutation({ variables: { input } });

        if (data?.register) {
          const { token, user } = data.register as AuthPayload;
          setToken(token);
          setUser(user);
          setIsAuthenticated(true);

          // Store in localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (input: any) => {
    try {
      setError(null);
      setIsLoading(true);

      if (process.env.NODE_ENV === 'development') {
        // For development, mock user update
        if (user) {
          const updatedUser = {
            ...user,
            firstName: input.firstName || user.firstName,
            lastName: input.lastName || user.lastName,
            email: input.email || user.email,
          };

          // Update user in state and localStorage
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        // For production, use the GraphQL mutation
        const { data } = await updateUserMutation({ variables: { input } });

        if (data?.updateUser) {
          setUser(data.updateUser);
          localStorage.setItem('user', JSON.stringify(data.updateUser));
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    // Remove from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
