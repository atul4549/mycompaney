// components/CB/Connect.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useConnectionStore } from "../../stores/useConnectionStore";

interface ConnectProps {
  setIsProcessing: (value: boolean) => void;
  isProcessing: boolean;
  userId: string;
  username: string;
}
import { useAuthStore } from "@/stores/authStore";
const Connect: React.FC<ConnectProps> = ({
  setIsProcessing,
  isProcessing,
  userId,
  username,
}) => {
  const { sendConnectionRequest, actionLoading } = useConnectionStore();
  const { userId: id } = useAuthStore() as {
    userId: string;
  };
  // console.log("my id", id);
  // console.log("user id", userId);
  const handleConnect = async () => {
    try {
      setIsProcessing(true);
      await sendConnectionRequest({ userId, senderId: id });

      Alert.alert(
        "Request Sent",
        `Connection request sent to ${username || "user"}!`,
        [{ text: "OK" }],
      );
    } catch (err) {
      // Error handled in store
      console.error("Failed to send connection request:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.connectButton}
      onPress={handleConnect}
      disabled={isProcessing || actionLoading}
      activeOpacity={0.7}
    >
      {isProcessing || actionLoading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <View style={styles.buttonContent}>
          <Ionicons name="person-add" size={18} color="white" />
          <Text style={styles.connectButtonText}>Connect</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  connectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 120,
    height: 40,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  connectButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default Connect;
