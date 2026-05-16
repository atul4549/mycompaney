import { StyleSheet } from "react-native";
import { Text, TouchableOpacity, View } from "react-native";

// --- Empty State Component ---
const EmptyState = ({ onRefresh }: { onRefresh: () => void }) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
      paddingVertical: 64,
    },
    emoji: {
      fontSize: 64,
      marginBottom: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 14,
      color: '#6b7280',
      textAlign: 'center',
      marginBottom: 24,
    },
    refreshButton: {
      backgroundColor: '#6366f1',
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    refreshButtonText: {
      color: '#ffffff',
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>👥</Text>
      <Text style={styles.title}>No Users Found</Text>
      <Text style={styles.subtitle}>
        Try adjusting your search or refresh to load users.
      </Text>
      <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
};
export default EmptyState;