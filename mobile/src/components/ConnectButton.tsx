// components/ConnectButton.tsx
import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useConnectionStore } from "../stores/useConnectionStore";
import Connect from "./CB/Connect";
import Pending from "./CB/Pending";
import AcceptReject from "./CB/AcceptReject";
import Connected from "./CB/Connected";

const ConnectButton = ({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const {
    connectionStatus,
    loading,
    error,
    actionLoading,
    checkConnectionStatus,
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    clearError,
  } = useConnectionStore();

  useEffect(() => {
    if (userId) {
      checkConnectionStatus(userId);
    }
  }, [userId]);

  // Show error alert
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
      clearError();
    }
  }, [error]);

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  }

  // No connection exists - Show Connect button
  if (!connectionStatus) {
    return (
      <Connect
        setIsProcessing={setIsProcessing}
        isProcessing={isProcessing}
        userId={userId}
        username={username}
      />
    );
  }

  // Pending request sent by current user
  if (
    connectionStatus.status === "pending" &&
    connectionStatus.requester._id !== userId
  ) {
    return <Pending />;
  }

  // Pending request received - Show Accept/Reject buttons
  if (
    connectionStatus.status === "pending" &&
    connectionStatus.requester._id === userId
  ) {
    return (
      <AcceptReject
        setIsProcessing={setIsProcessing}
        isProcessing={isProcessing}
        connectionId={connectionStatus._id}
        username={username}
      />
    );
  }

  // Already connected
  if (connectionStatus.status === "accepted") {
    return <Connected username={username} />;
  }

  return null;
};

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
});

export default ConnectButton;