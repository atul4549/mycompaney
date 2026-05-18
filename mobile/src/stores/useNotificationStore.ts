// stores/useNotificationStore.ts
import { create } from 'zustand';
// import axiosInstance from '../lib/axios';
import axios from 'axios';
import { axiosInstance } from './useUserStore';

interface User {
  _id: string;
  name: string;
  username: string;
  avatar?: string;
  headline?: string;
}

interface Connection {
  _id: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface Notification {
  _id: string;
  recipient: string;
  sender: User;
  type: 'connection_request' | 'connection_accepted' | 'message' | 'follow' | 'like';
  message: string;
  connectionId?: Connection;
  isRead: boolean;
  isActioned: boolean;
  createdAt: string;
}

interface Pagination {
  current: number;
  total: number;
  totalNotifications: number;
  unreadCount: number;
}

interface NotificationState {
  // State
  notifications: Notification[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  pagination: Pagination | null;
  unreadCount: number;
  actionLoading: string | null; // ID of notification being actioned

  // Actions
  fetchNotifications: (page?: number, type?: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  acceptConnectionRequest: (notificationId: string, connectionId: string) => Promise<void>;
  rejectConnectionRequest: (notificationId: string, connectionId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  loadMore: () => Promise<void>;
  clearError: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  // Initial state
  notifications: [],
  loading: false,
  refreshing: false,
  error: null,
  pagination: null,
  unreadCount: 0,
  actionLoading: null,

  // Fetch notifications
  // fetchNotifications: async (page = 1, type?: string) => {
  fetchNotifications: async (userId: string) => {
    // if (page === 1) {
    //   set({ loading: true, error: null });
    // }

    try {
    //   const url = type 
    //     ? `/notifications?page=${page}&limit=20&type=${type}`
    //     : `/notifications?page=${page}&limit=20`;

      // const response = await axiosInstance.get(url);
      const response = await axiosInstance.get(`/notifications/${userId}`);
    //   const { notifications, pagination } = response.data;
      // console.log(response.data.notifications);
      set((state) => ({
        notifications: response.data.notifications,
    //     notifications: page === 1 
    //       ? notifications 
    //       : [...state.notifications, ...notifications],
    //     pagination,
    //     unreadCount: pagination.unreadCount,
        loading: false,
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch notifications';
      set({ error: message, loading: false });
    }
  },

  // Refresh notifications (pull-to-refresh)
  refreshNotifications: async () => {
    set({ refreshing: true });
    await get().fetchNotifications(1);
    set({ refreshing: false });
  },

  // Mark single notification as read
  // markAsRead: async (notificationId: string) => {
  //   try {
  //     await axiosInstance.put(`/notifications/${notificationId}/read`);

  //     set((state) => ({
  //       notifications: state.notifications.map((notif) =>
  //         notif._id === notificationId ? { ...notif, isRead: true } : notif
  //       ),
  //       unreadCount: Math.max(0, state.unreadCount - 1),
  //     }));
  //   } catch (error) {
  //     console.error('Error marking notification as read:', error);
  //   }
  // },

  // Mark all notifications as read
  // markAllAsRead: async () => {
  //   try {
  //     await axiosInstance.put('/notifications/read-all');

  //     set((state) => ({
  //       notifications: state.notifications.map((notif) => ({
  //         ...notif,
  //         isRead: true,
  //       })),
  //       unreadCount: 0,
  //     }));
  //   } catch (error: any) {
  //     const message = error.response?.data?.message || 'Failed to mark all as read';
  //     set({ error: message });
  //   }
  // },

  // Accept connection request from notification
  acceptConnectionRequest: async (notificationId: string, connectionId: string) => {
    set({ actionLoading: notificationId, error: null });

    try {
      await axiosInstance.put(`/connections/accept/${connectionId}`);

      // Update notification status
      set((state) => ({
        notifications: state.notifications.map((notif) =>
          notif._id === notificationId
            ? {
                ...notif,
                isActioned: true,
                isRead: true,
                connectionId: notif.connectionId
                  ? { ...notif.connectionId, status: 'accepted' }
                  : notif.connectionId,
              }
            : notif
        ),
        actionLoading: null,
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to accept request';
      set({ error: message, actionLoading: null });
    }
  },

  // Reject connection request from notification
  rejectConnectionRequest: async (notificationId: string, connectionId: string) => {
    set({ actionLoading: notificationId, error: null });

    try {
      await axiosInstance.put(`/connections/reject/${connectionId}`);

      // Remove or update notification
      set((state) => ({
        notifications: state.notifications.map((notif) =>
          notif._id === notificationId
            ? {
                ...notif,
                isActioned: true,
                isRead: true,
                connectionId: notif.connectionId
                  ? { ...notif.connectionId, status: 'rejected' }
                  : notif.connectionId,
              }
            : notif
        ),
        actionLoading: null,
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to reject request';
      set({ error: message, actionLoading: null });
    }
  },

  // // Delete notification
  // deleteNotification: async (notificationId: string) => {
  //   try {
  //     await axiosInstance.delete(`/notifications/${notificationId}`);

  //     set((state) => ({
  //       notifications: state.notifications.filter(
  //         (notif) => notif._id !== notificationId
  //       ),
  //     }));
  //   } catch (error: any) {
  //     const message = error.response?.data?.message || 'Failed to delete notification';
  //     set({ error: message });
  //   }
  // },

  // // Clear all notifications
  // clearAllNotifications: async () => {
  //   try {
  //     await axiosInstance.delete('/notifications/clear-all');

  //     set({
  //       notifications: [],
  //       pagination: null,
  //       unreadCount: 0,
  //     });
  //   } catch (error: any) {
  //     const message = error.response?.data?.message || 'Failed to clear notifications';
  //     set({ error: message });
  //   }
  // },

  // // Load more notifications (pagination)
  // loadMore: async () => {
  //   const { pagination, loading } = get();
  //   if (loading || !pagination || pagination.current >= pagination.total) return;

  //   await get().fetchNotifications(pagination.current + 1);
  // },

  // Clear error
  clearError: () => set({ error: null }),
}));