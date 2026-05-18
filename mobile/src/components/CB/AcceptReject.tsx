// components/CB/AcceptReject.tsx
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

interface AcceptRejectProps {
  setIsProcessing: (value: boolean) => void;
  isProcessing: boolean;
  connectionId: string;
  username: string;
}

const AcceptReject: React.FC<AcceptRejectProps> = ({
  setIsProcessing,
  isProcessing,
  connectionId,
  username,
}) => {
  const { acceptConnectionRequest, rejectConnectionRequest, actionLoading } = useConnectionStore();

  const handleAccept = async () => {
    Alert.alert(
      'Accept Connection',
      `Accept connection request from ${username || 'this user'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              setIsProcessing(true);
              await acceptConnectionRequest(connectionId);
              
              Alert.alert(
                'Connected!',
                `You are now connected with ${username || 'this user'}!`,
                [{ text: 'OK' }]
              );
            } catch (err) {
              console.error('Failed to accept request:', err);
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  const handleReject = async () => {
    Alert.alert(
      'Reject Request',
      `Are you sure you want to reject the connection request from ${username || 'this user'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsProcessing(true);
              await rejectConnectionRequest(connectionId);
            } catch (err) {
              console.error('Failed to reject request:', err);
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {isProcessing || actionLoading ? (
        <ActivityIndicator size="small" color="#007AFF" style={styles.loader} />
      ) : (
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={handleAccept}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark" size={18} color="white" />
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rejectButton}
            onPress={handleReject}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={18} color="white" />
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    padding: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 4,
    minWidth: 100,
    height: 40,
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 4,
    minWidth: 100,
    height: 40,
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AcceptReject;