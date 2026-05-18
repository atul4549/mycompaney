// stores/useUserStore.ts
import { create } from "zustand";
import axios from "axios";
import { axiosInstance } from "@/stores/useUserStore"; // Adjust the import path as needed

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  [key: string]: any;
}

interface ApiError {
  message: string;
  status: number;
}

interface UserState {
  // State
  user: User | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchUserById: (userId: string) => Promise<void>;
  clearUser: () => void;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  // Initial state
  user: null,
  loading: false,
  error: null,

  // Fetch user by ID
  fetchUserById: async (userId: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
    //   console.log(response.data);
      set({ 
        user: response.data, 
        loading: false,
        error: null 
      });
    } catch (error) {
      let errorMessage = "Failed to fetch user";
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
        // console.error("Status:", error.response?.status);
      }
      
      set({ 
        user: null,
        loading: false, 
        error: errorMessage 
      });
    }
  },

  // Clear user state
  clearUser: () => set({ user: null, error: null, loading: false }),
  
  // Clear error only
  clearError: () => set({ error: null }),
}));