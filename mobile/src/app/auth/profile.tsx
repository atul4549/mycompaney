// import { View, Text, TouchableOpacity, Alert } from "react-native";
// import { useRouter } from "expo-router";
// import { useAuthStore } from "@/stores/authStore";
// import styles from "./profile.styles";
// import BottomNavigationBar from "@/components/BottomNavigationBar";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useEffect } from "react";

// export default function Profile() {
//   const router = useRouter();
//   //   const authStore = useAuthStore();

//   const { user, token, isCheckingAuth, checkAuth, logout } = useAuthStore() as {
//     user: any;
//     token: string;
//     isCheckingAuth: boolean;
//     checkAuth: () => Promise<void>;
//     logout: () => Promise<void>;
    
//   };

//   useEffect(() => {
//     checkAuth();
//   }, []);
//   //   const userId: string = authStore?.userId || "Not available";
// // console.log(user)
//   const handleLogout = () => {
//     Alert.alert("Logout", "Are you sure you want to logout?", [
//       {
//         text: "Cancel",
//         style: "cancel",
//       },
//       {
//         text: "Logout",
//         style: "destructive",
//         onPress: () => {
//           // Clear auth store
//         //   if (logout) {
//             logout();
//         //   }
//           // Navigate to login/signin page
//           router.replace("/auth/login");
//         },
//       },
//     ]);
//   };

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         backgroundColor: "#f9fafb",
//       }}
//     >
//       <View style={styles.container}>
//         <Text style={{ marginBottom: 10 }}>
//           Profile page in development mode
//         </Text>

//         <Text style={{ marginBottom: 10 }}>
//           Do not share this ID with someone else
//         </Text>

//         <Text style={{ marginBottom: 10 }}>
//           Your database ID is: 
//           {" "}
//           {/* <Text style={{ color: "skyblue" }}>{userId}</Text> */}
//           <Text style={{ color: "skyblue" }}>{user.name}</Text>
//           {" "}
//           <Text style={{ color: "skyblue" }}>{user.username}</Text>
//         </Text>

//         <TouchableOpacity onPress={() => router.back()}>
//           <Text style={{ color: "blue", marginTop: 20 }}>Go Back</Text>
//         </TouchableOpacity>

//         {/* Logout Button */}
//         <TouchableOpacity
//           onPress={handleLogout}
//           style={{
//             backgroundColor: "#ef4444",
//             paddingVertical: 12,
//             paddingHorizontal: 24,
//             borderRadius: 8,
//             marginTop: 20,
//             alignItems: "center",
//           }}
//         >
//           <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
//             Logout
//           </Text>
//         </TouchableOpacity>

//         <BottomNavigationBar />
//       </View>
//     </SafeAreaView>
//   );
// }

import { View, Text, TouchableOpacity, Alert, ScrollView, Image, Switch } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import styles from "./profile.styles";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const router = useRouter();
  const { user,userId, token, isCheckingAuth, checkAuth, logout } = useAuthStore() as {
    user: any;
    userId: string;
    token: string;
    isCheckingAuth: boolean;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
  };
  
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Logout", 
      "Are you sure you want to logout?", 
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: () => {
            logout();
            router.replace("/auth/login");
          }
        },
      ]
    );
  };

  const MenuItem = ({ icon, title, onPress, badge, danger = false }: any) => (
    <TouchableOpacity 
      style={styles.menuItem} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={24} color={danger ? "#ef4444" : "#6b7280"} />
        <Text style={[styles.menuText, danger && styles.dangerText]}>{title}</Text>
      </View>
      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
    </TouchableOpacity>
  );

  const SettingItem = ({ icon, title, value, onValueChange }: any) => (
    <View style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={24} color="#6b7280" />
        <Text style={styles.menuText}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#e5e7eb", true: "#3b82f6" }}
        thumbColor="#ffffff"
      />
    </View>
  );

  const StatCard = ({ label, value, icon }: any) => (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={24} color="#3b82f6" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            {/* <TouchableOpacity onPress={() => router.push('/')} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#1f2937" />
            </TouchableOpacity> */}
            {/* <TouchableOpacity style={styles.editButton}>
              <Ionicons name="create-outline" size={22} color="#3b82f6" />
            </TouchableOpacity> */}
          </View>
          
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: user?.avatar || "https://via.placeholder.com/100" }} 
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.changePhotoButton}>
                <Ionicons name="camera" size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{user?.name || "User Name"}</Text>
            <Text style={styles.userUsername}>@{user?.username || "username"}</Text>
            {/* <Text style={styles.userBio}>
              Digital enthusiast | Tech lover | Creative thinker
            </Text> */}
          </View>
        </View>

        {/* Stats Section */}
        {/* <View style={styles.statsContainer}>
          <StatCard label="Posts" value="24" icon="document-text-outline" />
          <StatCard label="Followers" value="1.2k" icon="people-outline" />
          <StatCard label="Following" value="342" icon="person-add-outline" />
        </View> */}

        {/* Account Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.infoCard}>
            {/* <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email || "user@example.com"}</Text>
            </View> */}
            {/* <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>User ID</Text>
              <Text style={styles.infoValueMonospace}>{userId || "Not available"}</Text>
            </View> */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>{user.createdAt}</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu</Text>
          <View style={styles.menuCard}>
            <MenuItem 
              icon="person-outline" 
              title="Personal Information" 
              onPress={() => router.push("/profile/edit")}
            />
            <MenuItem 
              icon="card-outline" 
              title="My Orders" 
              badge="3" 
              onPress={() => router.push("/profile/orders")}
            />
            <MenuItem 
              icon="heart-outline" 
              title="Wishlist" 
              badge="12" 
              onPress={() => router.push("/profile/wishlist")}
            />
            <MenuItem 
              icon="location-outline" 
              title="Addresses" 
              onPress={() => router.push("/profile/addresses")}
            />
          </View>
        </View> */}

        {/* Settings */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.menuCard}>
            <SettingItem 
              icon="notifications-outline" 
              title="Notifications" 
              value={notifications}
              onValueChange={setNotifications}
            />
            <SettingItem 
              icon="moon-outline" 
              title="Dark Mode" 
              value={darkMode}
              onValueChange={setDarkMode}
            />
            <MenuItem 
              icon="shield-checkmark-outline" 
              title="Privacy & Security" 
              onPress={() => router.push("/profile/privacy")}
            />
            <MenuItem 
              icon="language-outline" 
              title="Language" 
              badge="English" 
              onPress={() => router.push("/profile/language")}
            />
          </View>
        </View> */}

        {/* Support */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuCard}>
            <MenuItem 
              icon="help-circle-outline" 
              title="Help Center" 
              onPress={() => router.push("/profile/help")}
            />
            <MenuItem 
              icon="chatbubble-outline" 
              title="Contact Us" 
              onPress={() => router.push("/profile/contact")}
            />
            <MenuItem 
              icon="document-text-outline" 
              title="Terms & Conditions" 
              onPress={() => router.push("/profile/terms")}
            />
          </View>
        </View> */}

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={22} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.sectionTitle}>Created By @Himanshu</Text>
        </View>
      </ScrollView>
      
      <BottomNavigationBar />
    </SafeAreaView>
  );
}