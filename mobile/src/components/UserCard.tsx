import { StyleSheet } from "react-native";
import { Text, TouchableOpacity, View } from "react-native";

// --- User Card Component ---
const UserCard = ({
  user,
  onPress,
  onDelete,
}: {
  user: any;
  onPress: (user: any) => void;
  onDelete: (userId: string) => void;
}) => {
  const styles = StyleSheet.create({
    card: {
      backgroundColor: "#ffffff",
      borderRadius: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatarContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "#6366f1",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    avatarText: {
      color: "#ffffff",
      fontSize: 24,
      fontWeight: "bold",
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#1f2937",
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
      color: "#6b7280",
      marginBottom: 2,
    },
    userUsername: {
      fontSize: 12,
      color: "#9ca3af",
      fontStyle: "italic",
    },
    actionButtons: {
      flexDirection: "row",
      alignItems: "center",
    },
    deleteButton: {
      backgroundColor: "#ef4444",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      marginLeft: 8,
    },
    deleteButtonText: {
      color: "#ffffff",
      fontSize: 12,
      fontWeight: "600",
    },
    viewButton: {
      backgroundColor: "#6366f1",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    viewButtonText: {
      color: "#ffffff",
      fontSize: 12,
      fontWeight: "600",
    },
  });

  // Get initials from name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <TouchableOpacity onPress={() => onPress(user)} activeOpacity={0.7}>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            {/* <Text style={styles.userUsername}>@{user.username}</Text> */}
            <Text style={styles.userUsername}>@{user.username}</Text>
          </View>
          {/* <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => onPress(user)}
            >
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(user.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UserCard;
