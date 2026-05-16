import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TextInput as TextInputType,
  Image,
} from "react-native";
import { AxiosError } from "axios";
// import axios from "axios";
import useUserStore, { axiosInstance } from "../stores/useUserStore";
import styles from "@/styles/AppStyle";
import logo from "../assets/images/auth.png";
import { ToastProvider, useToast } from "../components/ToastComponent"; // Import the toast component

// --- Type Definitions ---
interface ApiResponse {
  success: boolean;
  data: unknown;
}

// --- Main App Content Component ---
const AppContent: React.FC = () => {
  // Local state for the input field before saving to store
  const [inputName, setInputName] = useState<string>("");
  const [username, setUsername] = useState<string>(""); // New state for username
  const [password, setPassword] = useState<string>(""); // Added password state
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean>(true);
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);

  const { userName, isSubmitting, setUserName, setIsSubmitting } =
    useUserStore() as {
      userName: string;
      isSubmitting: boolean;
      setUserName: (name: string) => void;
      setIsSubmitting: (status: boolean) => void;
    };

  const toast = useToast(); // Use the toast hook

  // --- Function to check if username is unique ---
  const checkUsernameUniqueness = async (
    usernameToCheck: string,
  ): Promise<boolean> => {
    if (!usernameToCheck.trim()) {
      setIsUsernameAvailable(true);
      return true;
    }

    setIsCheckingUsername(true);

    try {
      const response = await axiosInstance.get(
        `/check-username/${usernameToCheck}`,
        {
          timeout: 5000,
        },
      );

      const isAvailable = response.data.available === true;
      setIsUsernameAvailable(isAvailable);

      if (!isAvailable) {
        toast.show({
          type: "warning",
          text1: "Username Taken",
          text2: "This username is already taken. Please choose another one.",
          position: "top",
          visibilityTime: 3000,
        });
      }

      return isAvailable;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Username check error:", axiosError.message);
      // If API check fails, assume username is available
      setIsUsernameAvailable(true);
      return true;
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // --- API Call Simulation using Axios ---
  const submitNameToAPI = async (
    name: string,
    usernameValue: string,
    passwordValue: string,
  ): Promise<ApiResponse> => {
    const payload = {
      name: name,
      username: usernameValue,
      password: passwordValue, // Added password to payload
      timestamp: new Date().toISOString(),
      source: "auth_page",
    };

    try {
      const response = await axiosInstance.post("/submit-name", payload
      //   , {
      //   timeout: 10000,
      // }
    );

      console.log("API Response:", response.data);
      return { success: true, data: response.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("API Error:", axiosError.message);

      if (axiosError.response) {
        // Check if error is due to duplicate username
        if (axiosError.response.status === 409) {
          toast.show({
            type: "error",
            text1: "Username Taken",
            text2: "This username is already taken. Please choose another one.",
            position: "bottom",
            visibilityTime: 3000,
          });
          setIsUsernameAvailable(false);
          throw new Error("Username already taken");
        }

        toast.show({
          type: "error",
          text1: "Server Error",
          text2: `Server error: ${axiosError.response.status}`,
          position: "bottom",
          visibilityTime: 3000,
        });
        throw new Error(`Server error: ${axiosError.response.status}`);
      } else if (axiosError.request) {
        toast.show({
          type: "error",
          text1: "Network Error",
          text2: "Unable to reach the server",
          position: "bottom",
          visibilityTime: 3000,
        });
        throw new Error("Network error: Unable to reach the server");
      } else {
        toast.show({
          type: "error",
          text1: "Request Error",
          text2: axiosError.message,
          position: "bottom",
          visibilityTime: 3000,
        });
        throw new Error(`Request error: ${axiosError.message}`);
      }
    }
  };

  // --- Form Submission Handler ---
  const handleSubmit = async (): Promise<void> => {
    const trimmedName = inputName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName) {
      toast.show({
        type: "warning",
        text1: "Name Required",
        text2: "Please enter your name before joining the waitlist.",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    if (!trimmedUsername) {
      toast.show({
        type: "warning",
        text1: "Username Required",
        text2: "Please choose a username before joining the waitlist.",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    if (!trimmedPassword) {
      toast.show({
        type: "warning",
        text1: "Password Required",
        text2: "Please enter a password before joining the waitlist.",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    // Validate password strength (at least 6 characters)
    if (trimmedPassword.length < 6) {
      toast.show({
        type: "warning",
        text1: "Weak Password",
        text2: "Password must be at least 6 characters long.",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    // Validate username format (alphanumeric, underscore, dot)
    const usernameRegex = /^[a-zA-Z0-9_.]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
      toast.show({
        type: "warning",
        text1: "Invalid Username",
        text2:
          "Username can only contain letters, numbers, underscore, and dot.",
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    // Check if username is unique
    const isUnique = await checkUsernameUniqueness(trimmedUsername);
    if (!isUnique) {
      return;
    }

    setUserName(trimmedName);
    setIsSubmitting(true);

    try {
      await submitNameToAPI(trimmedName, trimmedUsername, trimmedPassword);
      setInputName("");
      setUsername("");
      setPassword(""); // Clear password field

      toast.show({
        type: "success",
        text1: "Success!",
        text2: `Thanks ${trimmedName}! You've been added to our waitlist with username @${trimmedUsername}.`,
        position: "bottom",
        visibilityTime: 3000,
      });
    } catch (error) {
      const err = error as Error;
      // Error already handled in submitNameToAPI
      if (err.message !== "Username already taken") {
        toast.show({
          type: "error",
          text1: "Submission Failed",
          text2: err.message || "Something went wrong. Please try again later.",
          position: "bottom",
          visibilityTime: 4000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputRef = useRef<TextInputType>(null);
  const usernameRef = useRef<TextInputType>(null);
  const passwordRef = useRef<TextInputType>(null); // Added password ref

  // Debounced username check
  const handleUsernameChange = async (text: string) => {
    setUsername(text);
    if (text.trim().length >= 3) {
      // Only check if username has at least 3 characters
      await checkUsernameUniqueness(text.trim());
    } else if (text.trim().length === 0) {
      setIsUsernameAvailable(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.contentWrapper}>
            {/* <Image source={logo} style={{
  width: 200,
  height: 200,
  marginBottom: 50,
  borderRadius: 50  // Fixed typo: borderRedius -> borderRadius
}} /> */}
            {/* <Image 
  source={logo} 
  style={{
    width: 200,
    height: 200,
    marginBottom: 50,
    borderRadius: 20, // Subtle rounded corners
    borderWidth: 2,
    borderColor: '#3b82f6',
  }} 
/> */}
            <View
              style={{
                width: 200,
                height: 200,
                marginBottom: 50,
                borderRadius: 20,
                backgroundColor: "#1e293b",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <Image
                source={logo}
                style={{
                  width: 180,
                  height: 180,
                  // borderRadius: 90,
                  borderRadius: 10,
                }}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.textInput}
                placeholder="Enter Your Name"
                placeholderTextColor="#64748b"
                value={inputName}
                onChangeText={setInputName}
                editable={!isSubmitting}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => usernameRef.current?.focus()}
              />
            </View>

            <View style={styles.inputContainer}>
              {/* <Text style={styles.inputLabel}>
                <Text style={{ fontSize: 12, color: '#64748b' }}> (unique with min length of 3)</Text>
              </Text> */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    position: "absolute",
                    left: 12,
                    zIndex: 1,
                    color: "#64748b",
                    fontSize: 16,
                  }}
                >
                  @
                </Text>
                <TextInput
                  ref={usernameRef}
                  style={[styles.textInput, { paddingLeft: 32 }]}
                  placeholder="username (min length of 3)"
                  placeholderTextColor="#64748b"
                  value={username}
                  onChangeText={handleUsernameChange}
                  editable={!isSubmitting}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="off"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
                {isCheckingUsername && (
                  <ActivityIndicator
                    size="small"
                    color="#3b82f6"
                    style={{ position: "absolute", right: 12 }}
                  />
                )}
              </View>
              {username.trim().length > 0 && (
                <Text
                  style={[
                    styles.usernameHint,
                    isUsernameAvailable
                      ? styles.usernameAvailable
                      : styles.usernameUnavailable,
                  ]}
                >
                  {isCheckingUsername
                    ? "Checking availability..."
                    : isUsernameAvailable
                      ? "✓ Username is available"
                      : "✗ Username is already taken"}
                </Text>
              )}
              <Text style={styles.usernameFormatHint}>
                Letters, numbers, underscore, and dot only
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                ref={passwordRef}
                style={styles.textInput}
                placeholder="Password (min. 6 characters)"
                placeholderTextColor="#64748b"
                value={password}
                onChangeText={setPassword}
                editable={!isSubmitting}
                secureTextEntry={true} // This hides the password input
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                (isSubmitting ||
                  (username.trim().length > 0 && !isUsernameAvailable)) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={
                isSubmitting ||
                (username.trim().length > 0 && !isUsernameAvailable)
              }
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? "Submitting..." : "Join"}
              </Text>
              {isSubmitting && (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                  style={styles.loader}
                />
              )}
            </TouchableOpacity>

            {/* <Text style={styles.infoText}>
              No spam, only important updates. You can unsubscribe anytime.
            </Text> */}

            {userName ? (
              <View style={styles.debugContainer}>
                <Text style={styles.debugText}>
                  🧠 Zustand Store: Hello, {userName}!
                </Text>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- Main App Component with Toast Provider ---
const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
