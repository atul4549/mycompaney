import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useAuthStore } from "../stores/authStore";
import styles from "../app/auth/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";

export default function LogoutButton() {
  const { logout } = useAuthStore() as {
    logout: () => void;
  };

  const confirmLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => logout(), style: "destructive" },
    ]);
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
      <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );
}
