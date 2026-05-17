// import { create } from "zustand";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { BASE_URL as API_URL } from "./useUserStore";

// export const useAuthStore = create((set) => ({
//   user: null,
//   token: null,
//   isLoading: false,
//   isCheckingAuth: true,

//   register: async (username, name, password) => {
//     set({ isLoading: true });
//     try {
//       const response = await fetch(`${API_URL}/auth/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           username,
//           name,
//           password,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) throw new Error(data.message || "Something went wrong");

//       await AsyncStorage.setItem("user", JSON.stringify(data.user));
//       await AsyncStorage.setItem("token", data.token);

//       set({ token: data.token, user: data.user, isLoading: false });

//       return { success: true };
//     } catch (error) {
//       set({ isLoading: false });
//       return { success: false, error: error.message };
//     }
//   },

//   login: async (username, password) => {
//     set({ isLoading: true });

//     try {
//       const response = await fetch(`${API_URL}/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           username,
//           password,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) throw new Error(data.message || "Something went wrong");

//       await AsyncStorage.setItem("user", JSON.stringify(data.user));
//       await AsyncStorage.setItem("token", data.token);

//       set({ token: data.token, user: data.user, isLoading: false });

//       return { success: true };
//     } catch (error) {
//       set({ isLoading: false });
//       return { success: false, error: error.message };
//     }
//   },

//   checkAuth: async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const userJson = await AsyncStorage.getItem("user");
//       const user = userJson ? JSON.parse(userJson) : null;

//       set({ token, user });
//     } catch (error) {
//       console.log("Auth check failed", error);
//     } finally {
//       set({ isCheckingAuth: false });
//     }
//   },

//   logout: async () => {
//     await AsyncStorage.removeItem("token");
//     await AsyncStorage.removeItem("user");
//     set({ token: null, user: null });
//   },
// }));

import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { axiosInstance } from "./useUserStore"; // Adjust the import path as needed
import { AxiosError } from "axios";

interface User {
  id: string;
  name: string;
  username: string;
  // Add other user fields as needed
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  register: (name: string, username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isCheckingAuth: true,

  register: async (name: string, username: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/auth/register", {
        name,
        username,
        password,
      });

      const { user, token } = response.data;
      console.log(user)
      console.log(token)
      // await AsyncStorage.setItem("user", JSON.stringify(user)); // ✅ Correct - stores string
      // await AsyncStorage.setItem("user", user);  // ❌ Wrong - AsyncStorage only stores strings!
      // ✅ Option 3: Store user data as separate fields (not recommended for complex objects)
      await AsyncStorage.setItem("userId", user.id);
      await AsyncStorage.setItem("userName", user.name);
      await AsyncStorage.setItem("userUsername", user.username);
      await AsyncStorage.setItem("token", token);

      set({ token, user, isLoading: false });

      return { success: true };
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 
                          axiosError.message || 
                          "Registration failed";
      
      set({ isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  login: async (username: string, password: string) => {
    set({ isLoading: true });

    try {
      const response = await axiosInstance.post("/auth/login", {
        username,
        password,
      });

      const { user, token } = response.data;
      // console.log(response.data)

      // await AsyncStorage.setItem("user", JSON.stringify(user));
      // await AsyncStorage.setItem("token", token);
      // await AsyncStorage.setItem("userName", user.name);

      await AsyncStorage.setItem("userId", user.id);
      await AsyncStorage.setItem("userUsername", user.username);
      await AsyncStorage.setItem("token", token);

      set({ token, user, isLoading: false });

      return { success: true };
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 
                          axiosError.message || 
                          "Login failed";
      
      set({ isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      // const userJson = await AsyncStorage.getItem("user");
      const userId = await AsyncStorage.getItem("userId");
      // const user = userId ? { id: userId } : null;
      // console.log(user)
      // if (token && userId) {
        // Optional: Verify token validity with backend
        // axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({ token, userId });
      // } else {
      //   set({ token: null, userId: null });
      // }
    } catch (error) {
      console.log("Auth check failed", error);
      set({ token: null, userId: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    try {
      // Optional: Call logout endpoint if needed
      // await axiosInstance.post("/auth/logout");
      
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      
      // Clear axios default header if you set it
      // delete axiosInstance.defaults.headers.common['Authorization'];
      
      set({ token: null, user: null });
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local storage even if API call fails
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      set({ token: null, user: null });
    }
  },
}));