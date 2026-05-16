import { Modal, ScrollView, StyleSheet } from "react-native";
import { Text, TouchableOpacity, View } from "react-native";
// --- User Detail Modal Component ---
const UserDetailModal = ({
  user,
  visible,
  onClose,
}: {
  user: any;
  visible: boolean;
  onClose: () => void;
}) => {
  if (!user) return null;

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: "#ffffff",
      borderRadius: 24,
      marginHorizontal: 24,
      padding: 24,
      width: "90%",
      maxWidth: 400,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#e5e7eb",
      paddingBottom: 12,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#1f2937",
    },
    closeButton: {
      fontSize: 24,
      color: "#6b7280",
      fontWeight: "bold",
    },
    detailRow: {
      marginBottom: 16,
    },
    detailLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: "#6b7280",
      marginBottom: 4,
    },
    detailValue: {
      fontSize: 16,
      color: "#1f2937",
    },
    addressContainer: {
      backgroundColor: "#f3f4f6",
      padding: 12,
      borderRadius: 8,
      marginTop: 8,
    },
    companyContainer: {
      backgroundColor: "#f3f4f6",
      padding: 12,
      borderRadius: 8,
      marginTop: 8,
    },
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>User Details</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name</Text>
              <Text style={styles.detailValue}>{user.name}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Username</Text>
              <Text style={styles.detailValue}>@{user.username}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{user.email}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{user.phone}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Website</Text>
              <Text style={styles.detailValue}>{user.website}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Address</Text>
              <View style={styles.addressContainer}>
                <Text style={styles.detailValue}>
                  {/* {user.address.street}, {user.address.suite} */}
                </Text>
                <Text style={styles.detailValue}>
                  {/* {user.address.city}, {user.address.zipcode} */}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Company</Text>
              <View style={styles.companyContainer}>
                <Text style={[styles.detailValue, { fontWeight: "600" }]}>
                  {/* {user.company.name} */}
                </Text>
                <Text
                  style={[styles.detailValue, { fontSize: 14, marginTop: 4 }]}
                >
                  {/* "{user.company.catchPhrase}" */}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
export default UserDetailModal;
