


import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../stores/authStore";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const { userId, token, isCheckingAuth, checkAuth } = useAuthStore();
// console.log('token',token)
// console.log('user',userId)
  useEffect(() => {
    checkAuth();
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    // Wait until auth check is complete
    if (isCheckingAuth) return;

    const inAuthGroup = segments[0] === "auth";
    const isSignedIn = userId && token;

    // console.log("Navigation check:", { inAuthGroup, isSignedIn, segments });

    if (!isSignedIn && !inAuthGroup) {
      router.replace("/auth/login");
    } else {
      router.push("/auth/profile");
    }
  }, [userId, token, segments, isCheckingAuth]);

  // Hide splash screen once auth check is complete
  useEffect(() => {
    if (!isCheckingAuth) {
      SplashScreen.hideAsync();
    }
  }, [isCheckingAuth]);

  // Show loading screen while checking authentication
  if (isCheckingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

}