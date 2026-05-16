// stores/useUserStore.ts
import axios, { AxiosError } from "axios";
import { create } from "zustand";
import Toast from 'react-native-toast-message';
import { Alert } from 'react-native';

const BASE_URL = 'https://mycompaney.onrender.com/api';
// const BASE_URL = 'https://localhost:5000/api';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// --- Type Definitions ---
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  company?: {
    name: string;
    catchPhrase: string;
  };
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username?: string;
  profilePicture?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  username?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SocketType {
  on: (event: string, callback: (data: any) => void) => void;
  emit: (event: string, data: any) => void;
  disconnect: () => void;
}

interface UserState {
  // Auth state
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: SocketType | null;
  isConnected: boolean;
  
  // User management state
  users: User[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedUser: User | null;
  
  // Coming soon page state
  userName: string;
  isSubmitting: boolean;
  
  // Auth actions
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  setSocket: (socket: SocketType | null) => void;
  setConnected: (isConnected: boolean) => void;
  setOnlineUsers: (users: string[]) => void;
  
  // User management actions
  setUsers: (users: User[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (searchQuery: string) => void;
  setSelectedUser: (selectedUser: User | null) => void;
  getFilteredUsers: () => User[];
  fetchUsers: () => Promise<User[]>;
  refreshUsers: () => Promise<void>;
  deleteUser: (userId: number) => void;
  
  // Coming soon actions
  setUserName: (name: string) => void;
  setIsSubmitting: (status: boolean) => void;
  resetComingSoon: () => void;
}

// --- Zustand Store Definition ---
const useUserStore = create<UserState>((set, get) => ({
  // Initial Auth State
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  isConnected: false,
  
  // Initial User Management State
  users: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedUser: null,
  
  // Initial Coming Soon State
  userName: '',
  isSubmitting: false,
  
  // --- Auth Actions ---
  register: async (data: RegisterData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      set({ authUser: res.data });
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Account created successfully',
        position: 'bottom',
        visibilityTime: 3000,
      });
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      const errorMessage = axiosError.response?.data?.message || "Signup failed";
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: errorMessage,
        position: 'bottom',
      });
      throw error;
    } finally {
      set({ isSigningUp: false });
    }
  },
  
  login: async (data: LoginData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Logged in successfully',
        position: 'bottom',
        visibilityTime: 3000,
      });
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      const errorMessage = axiosError.response?.data?.message || "Login failed";
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: errorMessage,
        position: 'bottom',
      });
      throw error;
    } finally {
      set({ isLoggingIn: false });
    }
  },
  
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null, socket: null, isConnected: false });
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Logged out successfully',
        position: 'bottom',
      });
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      const errorMessage = axiosError.response?.data?.message || "Logout failed";
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: errorMessage,
        position: 'bottom',
      });
    }
  },
  
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/me");
      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  
  updateProfile: async (data: Partial<AuthUser>) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/profile", data);
      set({ authUser: res.data });
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Profile updated successfully',
        position: 'bottom',
      });
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      const errorMessage = axiosError.response?.data?.message || "Profile update failed";
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: errorMessage,
        position: 'bottom',
      });
      throw error;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  
  setSocket: (socket: SocketType | null) => set({ socket }),
  setConnected: (isConnected: boolean) => set({ isConnected }),
  setOnlineUsers: (onlineUsers: string[]) => set({ onlineUsers }),
  
  // --- User Management Actions ---
  setUsers: (users: User[]) => set({ users }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  setSearchQuery: (searchQuery: string) => set({ searchQuery }),
  setSelectedUser: (selectedUser: User | null) => set({ selectedUser }),
  
  getFilteredUsers: () => {
    const { users, searchQuery } = get();
    if (!searchQuery.trim()) return users;
    return users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  },
  
  fetchUsers: async () => {
    const { setIsLoading, setUsers, setError } = get();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axiosInstance.get<User[]>('/users', {
        timeout: 10000,
      });
      
      setUsers(response.data);
      set({users: response?.data?.data})
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      let errorMessage = 'Failed to fetch users. ';
      
      if (axiosError.response) {
        errorMessage += `Server error: ${axiosError.response.status}`;
      } else if (axiosError.request) {
        errorMessage += 'Network error. Please check your connection.';
      } else {
        errorMessage += axiosError.message;
      }
      
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  },
  
  refreshUsers: async () => {
    await get().fetchUsers();
  },
  
  deleteUser: (userId: number) => {
    const { users, setUsers } = get();
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    Alert.alert('Success', 'User has been removed from the list.');
  },
  
  // --- Coming Soon Actions ---
  setUserName: (name: string) => set({ userName: name }),
  setIsSubmitting: (status: boolean) => set({ isSubmitting: status }),
  resetComingSoon: () => set({ userName: '', isSubmitting: false }),
}));

export default useUserStore;