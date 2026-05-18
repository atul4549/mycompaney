// components/CB/Connected.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ConnectedProps {
  username: string;
}

const Connected: React.FC<ConnectedProps> = ({ username }) => {
  return (
    <TouchableOpacity
      style={styles.connectedButton}
      disabled={true}
      activeOpacity={1}
    >
      <View style={styles.buttonContent}>
        <Ionicons name="checkmark-circle" size={18} color="#34C759" />
        <Text style={styles.connectedButtonText}>Connected</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  connectedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FFF0',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#34C759',
    minWidth: 120,
    height: 40,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  connectedButtonText: {
    color: '#34C759',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Connected;