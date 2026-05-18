// stores/useConnectionStore.ts
import { create } from 'zustand';
// import axios from 'axios';
import { axiosInstance } from './useUserStore';
// import axiosInstance from '../lib/axios';

interface Connection {
  _id: string;
  requester: {
    _id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  recipient: {
    _id: string;
    name: string;
    username: string;
    avatar?: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

interface ConnectionState {
  // State
  connectionStatus: Connection | null;
  connections: Connection[];
  loading: boolean;
  error: string | null;
  actionLoading: boolean;

  // Actions
  sendConnectionRequest: (userId: string) => Promise<void>;
  acceptConnectionRequest: (connectionId: string) => Promise<void>;
  rejectConnectionRequest: (connectionId: string) => Promise<void>;
  checkConnectionStatus: (userId: string) => Promise<void>;
  fetchConnections: (status?: string) => Promise<void>;
  clearError: () => void;
  resetState: () => void;
}

export const useConnectionStore = create<ConnectionState>((set, get) => ({
  // Initial state
  connectionStatus: null,
  connections: [],
  loading: false,
  error: null,
  actionLoading: false,

  // Send connection request
  sendConnectionRequest: async (userId: string) => {
    set({ actionLoading: true, error: null });
    
    try {
      const response = await axiosInstance.post(`/connections/connect/${userId}`);
      
      set((state) => ({
        connectionStatus: response.data.connection,
        actionLoading: false,
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send connection request';
      set({ 
        error: message,
        actionLoading: false 
      });
      throw error;
    }
  },

  // Accept connection request
  acceptConnectionRequest: async (connectionId: string) => {
    set({ actionLoading: true, error: null });
    
    try {
      const response = await axiosInstance.put(`/connections/accept/${connectionId}`);
      
      set((state) => ({
        connectionStatus: response.data.connection,
        connections: state.connections.map((conn) =>
          conn._id === connectionId ? response.data.connection : conn
        ),
        actionLoading: false,
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to accept request';
      set({ 
        error: message,
        actionLoading: false 
      });
      throw error;
    }
  },

  // Reject connection request
  rejectConnectionRequest: async (connectionId: string) => {
    set({ actionLoading: true, error: null });
    
    try {
      const response = await axiosInstance.put(`/connections/reject/${connectionId}`);
      
      set((state) => ({
        connectionStatus: null,
        connections: state.connections.filter((conn) => conn._id !== connectionId),
        actionLoading: false,
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to reject request';
      set({ 
        error: message,
        actionLoading: false 
      });
      throw error;
    }
  },

  // Check connection status
  checkConnectionStatus: async (userId: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await axiosInstance.get(`/connections/status/${userId}`);
      
      set({ 
        connectionStatus: response.data.connection,
        loading: false 
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to check connection status';
      set({ 
        error: message,
        loading: false 
      });
    }
  },

  // Fetch user's connections
  fetchConnections: async (status?: string) => {
    set({ loading: true, error: null });
    
    try {
      const url = status 
        ? `/connections?status=${status}`
        : '/connections';
        
      const response = await axiosInstance.get(url);
      
      set({ 
        connections: response.data.connections,
        loading: false 
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch connections';
      set({ 
        error: message,
        loading: false 
      });
    }
  },

  // // Start polling for connection updates
  // startPolling: (userId: string, interval = 30000) => {
  //   // Check every 30 seconds
  //   const pollInterval = setInterval(async () => {
  //     await get().checkConnectionStatus(userId);
  //   }, interval);

  //   // Return cleanup function
  //   return () => clearInterval(pollInterval);
  // },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset all state
  resetState: () => set({
    connectionStatus: null,
    connections: [],
    loading: false,
    error: null,
    actionLoading: false,
  }),
}));