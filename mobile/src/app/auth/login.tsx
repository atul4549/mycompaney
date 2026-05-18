import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import styles from "./login.styles";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "./color";

import { useAuthStore } from "../../stores/authStore";

import logo from "../../assets/images/auth.png";
// Define types for the auth store if not already defined
// interface AuthStore {
//   isLoading: boolean;
//   login: (username: string, password: string) => Promise<LoginResult>;
//   isCheckingAuth: boolean;
// }

// interface LoginResult {
//   success: boolean;
//   error?: string;
// }

// export default function Login(): JSX.Element | null {
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, login, isCheckingAuth } = useAuthStore() as {
    isLoading: boolean;
    login: (
      username: string,
      password: string,
    ) => Promise<{ success: boolean; error?: string }>;
    isCheckingAuth: boolean;
  };

  const handleLogin = async () => {
    const result = await login(username, password);

     if (!result.success) {
    Alert.alert("Error", result.error);
  } else {
    // Navigate to profile page after successful login
    navigation.navigate("/profile");
    // OR if using React Navigation v5/v6 with stack navigator:
    // navigation.replace("Profile"); // This prevents going back to login
  }
  };

  if (isCheckingAuth) return null;
  const router = useRouter();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        {/* ILLUSTRATION */}
        <View style={styles.topIllustration}>
          <Image
            source={logo}
            // source={require("../../assets/images/i.png")}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.card}>
          <View style={styles.formContainer}>
            {/* USERNAME */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  placeholderTextColor={COLORS.placeholderText}
                  value={username}
                  onChangeText={setUsername}
                  keyboardType="default"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* PASSWORD */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                {/* LEFT ICON */}
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                {/* INPUT */}
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.placeholderText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />

                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* FOOTER */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              {/* <Link href="/signup" asChild> */}
                <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                  <Text style={styles.link}>Sign Up</Text>
                </TouchableOpacity>
              {/* </Link> */}
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
