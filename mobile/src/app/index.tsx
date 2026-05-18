import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
} from "react-native";
import styles from "../styles/ChatListStyle";
import { useRouter } from "expo-router";
import logo from "../assets/images/logo.png";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNotificationStore } from "@/stores/useNotificationStore";
// import { useEffect, useState, useCallback } from "react";
// import { useUserStore } from "./store/userStore";
const Home = () => {
  const router = useRouter();
  const connect = () => {
    router.push({
      pathname: "/admin-talk/[id]",
      params: {
        // id: chat.id,
        // name: chat.name,
        // isAdminTalk: true,
        // adminId: chat.adminId,
        // participants: chat.participants,
      },
    });
  };
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f9fafb",
      }}
    >
      <View style={styles.container}>
        <StatusBar backgroundColor="#075E54" barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Himanshu Chat</Text>
          <View style={styles.headerIcons}>
            {/* Search Icon */}
            {/* <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => router.push("/search")}
            >
              <Ionicons name="search-outline" size={22} color="#fff" />
            </TouchableOpacity> */}

            {/* Notifications Icon with Badge */}
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => router.push("/Notifications")}
            >
              <Ionicons name="notifications-outline" size={22} color="#fff" />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Profile/Settings Icon */}
            {/* <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => router.push("/profile")}
            >
              <Ionicons name="person-circle-outline" size={22} color="#fff" />
            </TouchableOpacity> */}
          </View>
        </View>
        {/* Search Bar */}
        {/* Admin Talk Section */}
        {/* <View style={styles.adminTalkSection}> */}
        {/* <View style={styles.adminTalkHeader}> */}
        {/* <View style={styles.adminTalkIconContainer}>
                        <Icon name="chatbubble-ellipses" size={28} color="#075E54" />
                    </View> */}
        {/* <View style={styles.adminTalkInfo}>
            <Text style={styles.adminTalkTitle}>Community Chat with Admin</Text>
            <Text style={styles.adminTalkDescription}>
              Join the official community chat where all registered members can
              participate and talk directly with the admin. Share your ideas,
              ask questions, and connect with others!
            </Text>
            <View style={styles.adminTalkFeatures}>
                <Text style={styles.adminTalkFeature}>• Open to all registered users</Text>
            </View>
          </View> */}
        {/* </View> */}
        {/* </View> */}
        {/* custom admin */}
        <TouchableOpacity
          //   style={[styles.chatItem, item.isAdminTalk && styles.adminTalkItem]}
          // onPress={() => handleChatPress(item)}
          onPress={connect}
          style={styles.chatItem}
          activeOpacity={0.7}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={logo}
              style={[styles.avatar, { borderRadius: 50 }]}
            />
            <View style={styles.onlineDot} />
            {/* <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>Admin</Text>
            </View> */}
          </View>
          <View style={styles.chatInfo}>
            <Text style={styles.chatName}>Community Chat with Admin</Text>
            <Text style={styles.chatLastMessage}>
              Join the official community chat where all registered...
              {/* members can */}
              {/* participate and talk directly with the admin. Share your ideas, ask */}
              {/* questions, and connect with others! */}
            </Text>
          </View>
        </TouchableOpacity>
        {/* Chat List */}
        {/* FAB */}
        {/* Bottom Navigation Bar */}
        <BottomNavigationBar />
      </View>
    </SafeAreaView>
  );
};
export default Home;
