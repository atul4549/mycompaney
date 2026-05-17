import {
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import styles from "./signup.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "./color";
import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../stores/authStore";
import { axiosInstance } from "@/stores/useUserStore";
import { AxiosError } from "axios";
import { debounce } from "lodash"; // Install lodash if not already: npm install lodash @types/lodash

export default function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);

  const { isLoading, register } = useAuthStore() as {
    isLoading: boolean;
    register: (
      name: string,
      username: string,
      password: string,
    ) => Promise<{ success: boolean; error?: string }>;
  };

  const router = useRouter();

  // --- Function to check if username is unique ---
  const checkUsernameUniqueness = async (
    usernameToCheck: string,
  ): Promise<boolean> => {
    if (!usernameToCheck.trim()) {
      setIsUsernameAvailable(null);
      return true;
    }

    setIsCheckingUsername(true);

    try {
      const response = await axiosInstance.get(
        `/check-username/${encodeURIComponent(usernameToCheck)}`,
        {
          timeout: 5000,
        },
      );

      const isAvailable = response.data.available === true;
      setIsUsernameAvailable(isAvailable);
      return isAvailable;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Username check error:", axiosError.message);
      // On error, don't block signup but show warning
      setIsUsernameAvailable(null);
      return true;
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // Debounce username checking to avoid too many API calls
  const debouncedCheckUsername = useCallback(
    debounce(async (usernameValue: string) => {
      if (usernameValue.trim().length > 0) {
        await checkUsernameUniqueness(usernameValue);
      } else {
        setIsUsernameAvailable(null);
      }
    }, 500),
    []
  );

  const handleUsernameChange = (text: string) => {
    setUsername(text);
    debouncedCheckUsername(text);
  };

  const handleSignUp = async () => {
    const trimmedName = name.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    // Validation
    if (!trimmedName || !trimmedUsername || !trimmedPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (trimmedName.length < 2) {
      Alert.alert("Error", "Name must be at least 2 characters long.");
      return;
    }

    if (trimmedUsername.length < 3) {
      Alert.alert("Error", "Username must be at least 3 characters long.");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      Alert.alert("Error", "Username can only contain letters, numbers, and underscores.");
      return;
    }

    if (trimmedPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }

    // Final uniqueness check before registration
    const isUnique = await checkUsernameUniqueness(trimmedUsername);
    if (!isUnique) {
      Alert.alert("Error", "This username is already taken. Please choose another one.");
      return;
    }

    const result = await register(trimmedName, trimmedUsername, trimmedPassword);

    if (!result.success) {
      Alert.alert("Signup Failed", result.error || "An error occurred during signup.");
    }
  };

  // Helper to render username hint
  const renderUsernameHint = () => {
    if (username.trim().length === 0) return null;
    if (isCheckingUsername) {
      return (
        <Text style={[styles.usernameHint, styles.usernameChecking]}>
          Checking availability...
        </Text>
      );
    }
    if (isUsernameAvailable === true) {
      return (
        <Text style={[styles.usernameHint, styles.usernameAvailable]}>
          ✓ Username is available
        </Text>
      );
    }
    if (isUsernameAvailable === false) {
      return (
        <Text style={[styles.usernameHint, styles.usernameUnavailable]}>
          ✗ Username is already taken
        </Text>
      );
    }
    return null;
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
          </View>

          <View style={styles.formContainer}>
            {/* NAME INPUT */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor={COLORS.placeholderText}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* USERNAME INPUT */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputContainer}>
                <View style={styles.usernameInputWrapper}>
                  <Text style={styles.atSymbol}>@</Text>
                  <TextInput
                    style={styles.usernameInput}
                    placeholder="username"
                    placeholderTextColor={COLORS.placeholderText}
                    value={username}
                    onChangeText={handleUsernameChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {isCheckingUsername && (
                    <ActivityIndicator
                      size="small"
                      color="#3b82f6"
                      style={styles.checkingIndicator}
                    />
                  )}
                </View>
              </View>
              {renderUsernameHint()}
            </View>

            {/* PASSWORD INPUT */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Minimum 6 characters"
                  placeholderTextColor={COLORS.placeholderText}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* SIGNUP BUTTON */}
            <TouchableOpacity
              style={[
                styles.button,
                (isLoading || (username.trim().length > 0 && isUsernameAvailable === false)) && 
                styles.buttonDisabled
              ]}
              onPress={handleSignUp}
              disabled={isLoading || (username.trim().length > 0 && isUsernameAvailable === false)}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            {/* FOOTER */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity 
                onPress={() => router.push("/auth/login")}
                activeOpacity={0.7}
              >
                <Text style={styles.link}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}