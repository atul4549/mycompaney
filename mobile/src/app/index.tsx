// import React, { useState, useRef } from "react";
// import {
//   SafeAreaView,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StatusBar,
//   TextInput as TextInputType,
//   Image,
// } from "react-native";
// import { AxiosError } from "axios";
// // import axios from "axios";
// import useUserStore, { axiosInstance } from "../stores/useUserStore";
// import styles from "@/styles/AppStyle";
// import logo from '../assets/images/logo.png';
// import { ToastProvider, useToast } from '../components/ToastComponent'; // Import the toast component

// // --- Type Definitions ---
// interface ApiResponse {
//   success: boolean;
//   data: unknown;
// }

// // --- Main App Content Component ---
// const AppContent: React.FC = () => {
//   // Local state for the input field before saving to store
//   const [inputName, setInputName] = useState<string>("");
//   const { userName, isSubmitting, setUserName, setIsSubmitting } =
//     useUserStore() as {
//       userName: string;
//       isSubmitting: boolean;
//       setUserName: (name: string) => void;
//       setIsSubmitting: (status: boolean) => void;
//     };
  
//   const toast = useToast(); // Use the toast hook

//   // --- API Call Simulation using Axios ---
//   const submitNameToAPI = async (name: string): Promise<ApiResponse> => {
//     const payload = {
//       name: name,
//       timestamp: new Date().toISOString(),
//       source: "coming_soon_page",
//     };

//     try {
//       const response = await axiosInstance.post("/submit-name", payload, {
//         timeout: 10000,
//       });

//       console.log("API Response:", response.data);
//       return { success: true, data: response.data };
//     } catch (error) {
//       const axiosError = error as AxiosError;
//       console.error("API Error:", axiosError.message);

//       if (axiosError.response) {
//         toast.show({
//           type: 'error',
//           text1: 'Server Error',
//           text2: `Server error: ${axiosError.response.status}`,
//           position: 'bottom',
//           visibilityTime: 3000,
//         });
//         throw new Error(`Server error: ${axiosError.response.status}`);
//       } else if (axiosError.request) {
//         toast.show({
//           type: 'error',
//           text1: 'Network Error',
//           text2: 'Unable to reach the server',
//           position: 'bottom',
//           visibilityTime: 3000,
//         });
//         throw new Error("Network error: Unable to reach the server");
//       } else {
//         toast.show({
//           type: 'error',
//           text1: 'Request Error',
//           text2: axiosError.message,
//           position: 'bottom',
//           visibilityTime: 3000,
//         });
//         throw new Error(`Request error: ${axiosError.message}`);
//       }
//     }
//   };

//   // --- Form Submission Handler ---
//   const handleSubmit = async (): Promise<void> => {
//     const trimmedName = inputName.trim();

//     if (!trimmedName) {
//       toast.show({
//         type: 'warning',
//         text1: 'Name Required',
//         text2: 'Please enter your name before joining the waitlist.',
//         position: 'top',
//         visibilityTime: 3000,
//       });
//       return;
//     }

//     setUserName(trimmedName);
//     setIsSubmitting(true);

//     try {
//       await submitNameToAPI(trimmedName);
//       setInputName("");
      
//       toast.show({
//         type: 'success',
//         text1: 'Success!',
//         text2: `Thanks ${trimmedName}! You've been added to our waitlist.`,
//         position: 'bottom',
//         visibilityTime: 3000,
//       });
//     } catch (error) {
//       const err = error as Error;
//       toast.show({
//         type: 'error',
//         text1: 'Submission Failed',
//         text2: err.message || "Something went wrong. Please try again later.",
//         position: 'bottom',
//         visibilityTime: 4000,
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const inputRef = useRef<TextInputType>(null);

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           keyboardShouldPersistTaps="handled"
//         >
//           <View style={styles.contentWrapper}>
//             <Image source={logo} style={styles.logo} />

//             <Text style={styles.title}>Coming Soon</Text>

//             <Text style={styles.subtitle}>
//               We're working hard to bring you something amazing. Be the first to
//               know when we launch!
//             </Text>

//             <View style={styles.inputContainer}>
//               <Text style={styles.inputLabel}>Enter your name</Text>
//               <TextInput
//                 ref={inputRef}
//                 style={styles.textInput}
//                 placeholder="e.g., Himanshu"
//                 placeholderTextColor="#64748b"
//                 value={inputName}
//                 onChangeText={setInputName}
//                 editable={!isSubmitting}
//                 autoCapitalize="words"
//                 autoCorrect={false}
//                 returnKeyType="done"
//                 onSubmitEditing={handleSubmit}
//               />
//             </View>

//             <TouchableOpacity
//               style={[styles.button, isSubmitting && styles.buttonDisabled]}
//               onPress={handleSubmit}
//               disabled={isSubmitting}
//               activeOpacity={0.8}
//             >
//               <Text style={styles.buttonText}>
//                 {isSubmitting ? "Submitting..." : "Join Waitlist"}
//               </Text>
//               {isSubmitting && (
//                 <ActivityIndicator
//                   size="small"
//                   color="#ffffff"
//                   style={styles.loader}
//                 />
//               )}
//             </TouchableOpacity>

//             <Text style={styles.infoText}>
//               No spam, only important updates. You can unsubscribe anytime.
//             </Text>

//             {userName ? (
//               <View style={styles.debugContainer}>
//                 <Text style={styles.debugText}>
//                   🧠 Zustand Store: Hello, {userName}!
//                 </Text>
//               </View>
//             ) : null}
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// // --- Main App Component with Toast Provider ---
// const App: React.FC = () => {
//   return (
//     <ToastProvider>
//       <AppContent />
//     </ToastProvider>
//   );
// };

// export default App;

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
import logo from '../assets/images/logo.png';
import { ToastProvider, useToast } from '../components/ToastComponent'; // Import the toast component

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
  const checkUsernameUniqueness = async (usernameToCheck: string): Promise<boolean> => {
    if (!usernameToCheck.trim()) {
      setIsUsernameAvailable(true);
      return true;
    }

    setIsCheckingUsername(true);
    
    try {
      const response = await axiosInstance.get(`/check-username/${usernameToCheck}`, {
        timeout: 5000,
      });
      
      const isAvailable = response.data.available === true;
      setIsUsernameAvailable(isAvailable);
      
      if (!isAvailable) {
        toast.show({
          type: 'warning',
          text1: 'Username Taken',
          text2: 'This username is already taken. Please choose another one.',
          position: 'top',
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
  const submitNameToAPI = async (name: string, usernameValue: string): Promise<ApiResponse> => {
    const payload = {
      name: name,
      username: usernameValue,
      timestamp: new Date().toISOString(),
      source: "coming_soon_page",
    };

    try {
      const response = await axiosInstance.post("/submit-name", payload, {
        timeout: 10000,
      });

      console.log("API Response:", response.data);
      return { success: true, data: response.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("API Error:", axiosError.message);

      if (axiosError.response) {
        // Check if error is due to duplicate username
        if (axiosError.response.status === 409) {
          toast.show({
            type: 'error',
            text1: 'Username Taken',
            text2: 'This username is already taken. Please choose another one.',
            position: 'bottom',
            visibilityTime: 3000,
          });
          setIsUsernameAvailable(false);
          throw new Error("Username already taken");
        }
        
        toast.show({
          type: 'error',
          text1: 'Server Error',
          text2: `Server error: ${axiosError.response.status}`,
          position: 'bottom',
          visibilityTime: 3000,
        });
        throw new Error(`Server error: ${axiosError.response.status}`);
      } else if (axiosError.request) {
        toast.show({
          type: 'error',
          text1: 'Network Error',
          text2: 'Unable to reach the server',
          position: 'bottom',
          visibilityTime: 3000,
        });
        throw new Error("Network error: Unable to reach the server");
      } else {
        toast.show({
          type: 'error',
          text1: 'Request Error',
          text2: axiosError.message,
          position: 'bottom',
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

    if (!trimmedName) {
      toast.show({
        type: 'warning',
        text1: 'Name Required',
        text2: 'Please enter your name before joining the waitlist.',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (!trimmedUsername) {
      toast.show({
        type: 'warning',
        text1: 'Username Required',
        text2: 'Please choose a username before joining the waitlist.',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    // Validate username format (alphanumeric, underscore, dot)
    const usernameRegex = /^[a-zA-Z0-9_.]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
      toast.show({
        type: 'warning',
        text1: 'Invalid Username',
        text2: 'Username can only contain letters, numbers, underscore, and dot.',
        position: 'top',
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
      await submitNameToAPI(trimmedName, trimmedUsername);
      setInputName("");
      setUsername("");
      
      toast.show({
        type: 'success',
        text1: 'Success!',
        text2: `Thanks ${trimmedName}! You've been added to our waitlist with username @${trimmedUsername}.`,
        position: 'bottom',
        visibilityTime: 3000,
      });
    } catch (error) {
      const err = error as Error;
      // Error already handled in submitNameToAPI
      if (err.message !== "Username already taken") {
        toast.show({
          type: 'error',
          text1: 'Submission Failed',
          text2: err.message || "Something went wrong. Please try again later.",
          position: 'bottom',
          visibilityTime: 4000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputRef = useRef<TextInputType>(null);
  const usernameRef = useRef<TextInputType>(null);

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
            <Image source={logo} style={styles.logo} />

            <Text style={styles.title}>Coming Soon</Text>

            <Text style={styles.subtitle}>
              We're working hard to bring you something amazing. Be the first to
              know when we launch!
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Enter your name</Text>
              <TextInput
                ref={inputRef}
                style={styles.textInput}
                placeholder="e.g., Himanshu"
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
              <Text style={styles.inputLabel}>
                Choose a username
                <Text style={{ fontSize: 12, color: '#64748b' }}> (unique with min length of 3)</Text>
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ 
                  position: 'absolute', 
                  left: 12, 
                  zIndex: 1, 
                  color: '#64748b',
                  fontSize: 16 
                }}>
                  @
                </Text>
                <TextInput
                  ref={usernameRef}
                  style={[styles.textInput, { paddingLeft: 32 }]}
                  placeholder="username"
                  placeholderTextColor="#64748b"
                  value={username}
                  onChangeText={handleUsernameChange}
                  editable={!isSubmitting}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="off"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
                {isCheckingUsername && (
                  <ActivityIndicator
                    size="small"
                    color="#3b82f6"
                    style={{ position: 'absolute', right: 12 }}
                  />
                )}
              </View>
              {username.trim().length > 0 && (
                <Text style={[
                  styles.usernameHint,
                  isUsernameAvailable ? styles.usernameAvailable : styles.usernameUnavailable
                ]}>
                  {isCheckingUsername ? 'Checking availability...' : 
                   isUsernameAvailable ? '✓ Username is available' : '✗ Username is already taken'}
                </Text>
              )}
              <Text style={styles.usernameFormatHint}>
                Letters, numbers, underscore, and dot only
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.button, 
                (isSubmitting || (username.trim().length > 0 && !isUsernameAvailable)) && 
                styles.buttonDisabled
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting || (username.trim().length > 0 && !isUsernameAvailable)}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? "Submitting..." : "Join Waitlist"}
              </Text>
              {isSubmitting && (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                  style={styles.loader}
                />
              )}
            </TouchableOpacity>

            <Text style={styles.infoText}>
              No spam, only important updates. You can unsubscribe anytime.
            </Text>

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