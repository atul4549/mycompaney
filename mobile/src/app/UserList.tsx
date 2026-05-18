

import BottomNavigationBar from "@/components/BottomNavigationBar";
import EmptyState from "@/components/EmptyState";
import UserCard from "@/components/UserCard";
// import UserDetailModal from "@/components/UserDetailModal";
import useUserStore from "@/stores/useUserStore";
// // import { Icon } from 'expo-router';
import Icon from "react-native-vector-icons/Ionicons";
import React, { useState, useEffect, useCallback } from "react";
import {
  // SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput,
  StatusBar,
  Modal,
  ScrollView,
  SafeAreaView,
} from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// // import axios from 'axios';
// // import { create } from 'zustand';

// // --- Main User List Page Component ---
// const UserListPage = () => {
//   const { isLoading, error, fetchUsers, refreshUsers, deleteUser, users } =
//     useUserStore();
//   // console.log(users)
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedUser, setSelectedUser] = useState(null); // Also add this - it's used but missing
//   const [refreshing, setRefreshing] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);

//   // Fetch users on component mount
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // Handle refresh
//   const handleRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await refreshUsers();
//     setRefreshing(false);
//   }, [refreshUsers]);

//   // Handle user press
//   const handleUserPress = (user) => {
//     // navigate to user profile page
//     setSelectedUser(user);
//     setModalVisible(true);
//   };

//   // Handle delete with confirmation
//   const handleDelete = (userId, userName) => {
//     Alert.alert(
//       "Delete User",
//       `Are you sure you want to remove ${userName} from the list?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: () => deleteUser(userId),
//         },
//       ],
//     );
//   };

//   // Get filtered users
//   //   const filteredUsers = getFilteredUsers();
//   const filteredUsers = users.filter((user) => {
//     const query = searchQuery.toLowerCase().trim();
//     if (!query) return true;
//     return user.username?.toLowerCase().includes(query);
//   });

//   console.log(filteredUsers);
  // Styles
  const styles = {
    safeArea: {
      flex: 1,
      backgroundColor: "#f9fafb",
    },
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    header: {
      backgroundColor: "#ffffff",
      paddingHorizontal: 16,
      paddingTop: 50,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#e5e7eb",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#1f2937",
      marginBottom: 16,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#f3f4f6",
      borderRadius: 12,
      paddingHorizontal: 12,
      marginBottom: 12,
    },
    searchIcon: {
      fontSize: 16,
      color: "#6b7280",
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      paddingVertical: 12,
      color: "#1f2937",
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 8,
    },
    statsText: {
      fontSize: 14,
      color: "#6b7280",
    },
    refreshButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: "#6366f1",
      borderRadius: 8,
    },
    refreshButtonText: {
      color: "#ffffff",
      fontSize: 12,
      fontWeight: "600",
    },
    listContainer: {
      paddingVertical: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      marginTop: 12,
      color: "#6b7280",
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 32,
    },
    errorText: {
      fontSize: 16,
      color: "#ef4444",
      textAlign: "center",
      marginBottom: 16,
    },
    retryButton: {
      backgroundColor: "#6366f1",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
    },
    retryButtonText: {
      color: "#ffffff",
      fontWeight: "600",
    },
  };

//   // Render loading state
//   if (isLoading && !refreshing) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#6366f1" />
//           <Text style={styles.loadingText}>Loading users...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // Render error state
//   // if (error && !isLoading) {
//   //   return (
//   //     <SafeAreaView style={styles.safeArea}>
//   //       <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
//   //       <View style={styles.errorContainer}>
//   //         <Text style={styles.errorText}>{error}</Text>
//   //         <TouchableOpacity style={styles.retryButton} onPress={fetchUsers}>
//   //           <Text style={styles.retryButtonText}>Try Again</Text>
//   //         </TouchableOpacity>
//   //       </View>
//   //     </SafeAreaView>
//   //   );
//   // }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
//         <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

//         {/* Header with Search */}
//         <View style={styles.header}>
//           <Text style={styles.title}>Wait List Users</Text>

//           <View style={styles.searchContainer}>
//             <Text style={styles.searchIcon}>
//               <Icon name="search" size={16} color="#6b7280" />
//             </Text>
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search by name, email, or username..."
//               placeholderTextColor="#9ca3af"
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//               clearButtonMode="while-editing"
//             />
//           </View>

//           {/* <View style={styles.statsContainer}>
//           <Text style={styles.statsText}>
//             {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
//           </Text>
//           <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
//             <Text style={styles.refreshButtonText}>Refresh</Text>
//           </TouchableOpacity>
//         </View> */}
//         </View>

//         {/* User List */}
//         <FlatList
//           data={filteredUsers}
//           // data={users}
//           keyExtractor={(item) => item._id.toString()}
//           // keyExtractor={(item) => item._id}
//           renderItem={({ item }) => (
//             // console.log(item)
//             <UserCard
//               user={item}
//               onPress={handleUserPress}
//               onDelete={(userId) => handleDelete(userId, item.name)}
//             />
//           )}
//           contentContainerStyle={styles.listContainer}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={handleRefresh}
//               colors={["#6366f1"]}
//               tintColor="#6366f1"
//             />
//           }
//           ListEmptyComponent={<EmptyState onRefresh={handleRefresh} />}
//           showsVerticalScrollIndicator={false}
//         />

//         {/* User Detail Modal */}
//         <UserDetailModal
//           user={selectedUser}
//           visible={modalVisible}
//           onClose={() => {
//             setModalVisible(false);
//             setSelectedUser(null);
//           }}
//         />
//         <BottomNavigationBar />
//       </View>
//     </SafeAreaView>
//   );
// };

// export default UserListPage;

import { useNavigation } from '@react-navigation/native';
// ... other imports

const UserListPage = () => {
  const navigation = useNavigation();
  const { isLoading, error, fetchUsers, refreshUsers, deleteUser, users } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshUsers();
    setRefreshing(false);
  }, [refreshUsers]);

  // Handle user press - Navigate to profile page
  const handleUserPress = (user: any) => {
    navigation.navigate('UserProfile', { 
      userId: user._id, 
    });
  };

  // Handle delete with confirmation
  const handleDelete = (userId: string, userName: string) => {
    Alert.alert(
      "Delete User",
      `Are you sure you want to remove ${userName} from the list?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteUser(userId: string),
        },
      ],
    );
  };

  // Get filtered users
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return user.username?.toLowerCase().includes(query);
  });

  // ... rest of your component code (styles remain the same)
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

        {/* Header with Search */}
        <View style={styles.header}>
          <Text style={styles.title}>Wait List Users</Text>

          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>
              <Icon name="search" size={16} color="#6b7280" />
            </Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, email, or username..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
          </View>
        </View>

        {/* User List */}
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <UserCard
              user={item}
              onPress={handleUserPress}
              onDelete={(userId) => handleDelete(userId, item.name)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#6366f1"]}
              tintColor="#6366f1"
            />
          }
          ListEmptyComponent={<EmptyState onRefresh={handleRefresh} />}
          showsVerticalScrollIndicator={false}
        />

        <BottomNavigationBar />
      </View>
    </SafeAreaView>
  );
};

export default UserListPage;