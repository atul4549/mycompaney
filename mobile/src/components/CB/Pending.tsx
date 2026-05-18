// components/CB/Pending.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Pending: React.FC = () => {
  return (
    <TouchableOpacity
      style={styles.pendingButton}
      disabled={true}
      activeOpacity={1}
    >
      <View style={styles.buttonContent}>
        <Ionicons name="time" size={18} color="#666" />
        <Text style={styles.pendingButtonText}>Request Sent</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pendingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minWidth: 120,
    height: 40,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pendingButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Pending;