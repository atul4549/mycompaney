// // // UserProfile.js
// // import React, { useEffect } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ScrollView,
// //   TouchableOpacity,
// //   Image,
// // } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// // import Icon from "react-native-vector-icons/Ionicons";
// import { useRouter, useLocalSearchParams } from "expo-router";
// // import { axiosInstance } from "@/stores/useUserStore";
// // const UserProfile = () => {
// //   const router = useRouter();
// //   //   const { userId, userData } = route.params || {};
// //   const { userId, userData } = useLocalSearchParams();
// //   console.log(userId);

// //   useEffect(() => {
// //     // Basic GET request
// //     const getUserById = async (userId: string) => {
// //       try {
// //         const response = await axiosInstance.get(`/api/users/${userId}`);
// //         return response.data;
// //       } catch (error) {
// //         console.error("Error fetching user:", error);
// //         throw error;
// //       }
// //     };
// //     getUserById(userId);
// //   }, [userId]);
// //   return { user, loading, error }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <View style={styles.header}>
// //         <TouchableOpacity
// //           style={styles.backButton}
// //           onPress={() => navigation.back()}
// //         >
// //           <Icon name="arrow-back" size={24} color="#1f2937" />
// //         </TouchableOpacity>
// //         <Text style={styles.headerTitle}>User Profile</Text>
// //         <View style={styles.placeholder} />
// //       </View>

// //       <ScrollView contentContainerStyle={styles.content}>
// //         {/* Avatar */}
// //         <View style={styles.avatarContainer}>
// //           <View style={styles.avatar}>
// //             <Text style={styles.avatarText}>
// //               {userData?.username?.charAt(0).toUpperCase() || "U"}
// //             </Text>
// //           </View>
// //         </View>

// //         {/* User Info */}
// //         <View style={styles.infoCard}>
// //           <View style={styles.infoRow}>
// //             <Icon name="person-outline" size={20} color="#6b7280" />
// //             <Text style={styles.infoLabel}>Username:</Text>
// //             <Text style={styles.infoValue}>{userData?.username || "N/A"}</Text>
// //           </View>

// //           <View style={styles.infoRow}>
// //             <Icon name="mail-outline" size={20} color="#6b7280" />
// //             <Text style={styles.infoLabel}>Email:</Text>
// //             <Text style={styles.infoValue}>{userData?.email || "N/A"}</Text>
// //           </View>

// //           <View style={styles.infoRow}>
// //             <Icon name="calendar-outline" size={20} color="#6b7280" />
// //             <Text style={styles.infoLabel}>Joined:</Text>
// //             <Text style={styles.infoValue}>
// //               {userData?.createdAt
// //                 ? new Date(userData.createdAt).toLocaleDateString()
// //                 : "N/A"}
// //             </Text>
// //           </View>

// //           {/* Add more user fields as needed */}
// //         </View>
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "#f9fafb",
// //   },
// //   header: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "space-between",
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     backgroundColor: "#ffffff",
// //     borderBottomWidth: 1,
// //     borderBottomColor: "#e5e7eb",
// //   },
// //   backButton: {
// //     padding: 8,
// //   },
// //   headerTitle: {
// //     fontSize: 18,
// //     fontWeight: "600",
// //     color: "#1f2937",
// //   },
// //   placeholder: {
// //     width: 40,
// //   },
// //   content: {
// //     padding: 20,
// //   },
// //   avatarContainer: {
// //     alignItems: "center",
// //     marginBottom: 24,
// //   },
// //   avatar: {
// //     width: 100,
// //     height: 100,
// //     borderRadius: 50,
// //     backgroundColor: "#6366f1",
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   avatarText: {
// //     fontSize: 40,
// //     fontWeight: "bold",
// //     color: "#ffffff",
// //   },
// //   infoCard: {
// //     backgroundColor: "#ffffff",
// //     borderRadius: 12,
// //     padding: 16,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 4,
// //     elevation: 2,
// //   },
// //   infoRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     paddingVertical: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: "#f3f4f6",
// //   },
// //   infoLabel: {
// //     fontSize: 14,
// //     fontWeight: "500",
// //     color: "#4b5563",
// //     marginLeft: 12,
// //     width: 80,
// //   },
// //   infoValue: {
// //     flex: 1,
// //     fontSize: 14,
// //     color: "#1f2937",
// //   },
// // });

// // export default UserProfile;
// // components/UserProfile.tsx
// import { useEffect } from "react";
// import { useUserStore } from "./UserProfileStore";

// const UserProfile = () =>
//   // { userId }: { userId: string }

//   {
//     const { userId } = useLocalSearchParams();
//     console.log(userId)
//     const { user, loading, error, fetchUserById, clearUser } = useUserStore();
//     // console.log(user?.data)
//     useEffect(() => {
//       if (userId) {
//         fetchUserById(userId);
//       }

//       // Cleanup when component unmounts or userId changes
//       return () => {
//         clearUser();
//       };
//     }, [userId, fetchUserById, clearUser]);

//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error}</div>;
//     if (!user) return <div>User not found</div>;

//     return (
//       <div>
//         <h1>{user?.data.name}</h1>
//         <p>@{user?.data.username}</p>
//       </div>
//     );
//   };

// export default UserProfile;

// UserProfile.tsx
import { useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  // SafeAreaView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useUserStore } from "./UserProfileStore";
import ConnectButton from "@/components/ConnectButton";
import dayjs from "dayjs";
import BottomNavigationBar from "@/components/BottomNavigationBar";
const UserProfile = () => {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  // console.log(userId);

  const { user, loading, error, fetchUserById, clearUser } = useUserStore();

  useEffect(() => {
    if (userId) {
      fetchUserById(userId);
    }

    // Cleanup when component unmounts or userId changes
    return () => {
      clearUser();
    };
  }, [userId, fetchUserById, clearUser]);

  // Loading State
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Error State
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  // User Not Found State
  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.notFoundText}>User not found</Text>
      </View>
    );
  }

  // Helper function
  const formatCreatedAt = (dateString: string) => {
    const date = dayjs(dateString);
    const now = dayjs();

    const years = now.diff(date, "year");
    const months = now.diff(date, "month");
    const days = now.diff(date, "day");

    if (days < 1) return "Today";
    if (days < 7) return `${days} days ago`;
    if (months < 1) return `${Math.floor(days / 7)} weeks ago`;
    if (years < 1) return `${months} months ago`;
    return `${years} years ago`;
  };

  // User Profile Display
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileCard}>
        {/* Avatar Placeholder */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.data?.name?.charAt(0)?.toUpperCase() || "U"}
          </Text>
        </View>

        {/* User Info */}
        <Text style={styles.name}>{user?.data?.name}</Text>
        <Text style={styles.username}>@{user?.data?.username}</Text>
        {/* <Text style={styles.createdAt}>user since {user?.data?.createdAt}</Text> */}
        <Text style={styles.createdAt}>
          {/* Member since {dayjs(user?.data?.createdAt).format("MMMM YYYY")} */}
          {/* // In component: */}
          <View style={styles.membershipBadge}>
            {/* <Ionicons name="time-outline" size={16} color="#666" /> */}
            <Text style={styles.createdAt}>
              {user?.data?.createdAt
                ? `${formatCreatedAt(user.data.createdAt)} on ${dayjs(user.data.createdAt).format("MMM D, YYYY")}`
                : "Recently joined"}
            </Text>
          </View>
        </Text>
        {/* {formatCreatedAt()} */}
        {/* Email if available */}
        {user?.data?.email && (
          <Text style={styles.email}>{user?.data?.email}</Text>
        )}
        {/* Connect/Accept Button */}
        <View style={styles.connectButtonContainer}>
          <ConnectButton userId={userId} username={user?.data?.username} />
        </View>
      </View>
      <BottomNavigationBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  profileCard: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  email: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  notFoundText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },

  // In styles:
  createdAt: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
    fontStyle: "italic",
    marginLeft: 5,
  },
  connectButtonContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },

  // // In styles:
  membershipBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
  },
});

export default UserProfile;
