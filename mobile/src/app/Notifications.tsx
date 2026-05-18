// screens/NotificationsScreen.tsx
import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  // SafeAreaView,
  Image,
} from "react-native";
// import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { useNotificationStore } from "../stores/useNotificationStore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import BottomNavigationBar from "@/components/BottomNavigationBar";
import { SafeAreaView } from "react-native-safe-area-context";
dayjs.extend(relativeTime);
import styles from "./NotificationStyle";
import { useAuthStore } from "@/stores/authStore";
// const NotificationsScreen = () => {
//   const router = useRouter();
//   const {
//     notifications,
//     loading,
//     refreshing,
//     error,
//     unreadCount,
//     actionLoading,
//     pagination,
//     fetchNotifications,
//     refreshNotifications,
//     markAsRead,
//     markAllAsRead,
//     acceptConnectionRequest,
//     rejectConnectionRequest,
//     deleteNotification,
//     loadMore,
//     clearError,
//   } = useNotificationStore();

//   const [selectedFilter, setSelectedFilter] = useState<string>('all');

//   useEffect(() => {
//     fetchNotifications(1, selectedFilter === 'all' ? undefined : selectedFilter);
//   }, [selectedFilter]);

//   // Show error alert
//   useEffect(() => {
//     if (error) {
//       Alert.alert('Error', error, [{ text: 'OK', onPress: clearError }]);
//     }
//   }, [error]);

//   const handleDelete = (notificationId: string) => {
//     Alert.alert(
//       'Delete Notification',
//       'Are you sure you want to delete this notification?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: () => deleteNotification(notificationId),
//         },
//       ]
//     );
//   };

//   const handleNotificationPress = (notification: any) => {
//     // Mark as read
//     if (!notification.isRead) {
//       markAsRead(notification._id);
//     }

//     // Navigate based on notification type
//     if (
//       notification.type === 'connection_request' ||
//       notification.type === 'connection_accepted'
//     ) {
//       router.push(`/profile/${notification.sender._id}`);
//     }
//   };

//   const getTimeAgo = (dateString: string) => {
//     return dayjs(dateString).fromNow();
//   };

//   const getNotificationIcon = (type: string) => {
//     switch (type) {
//       case 'connection_request':
//         return 'person-add';
//       case 'connection_accepted':
//         return 'people';
//       case 'message':
//         return 'chatbubble';
//       case 'follow':
//         return 'person';
//       case 'like':
//         return 'heart';
//       default:
//         return 'notifications';
//     }
//   };

//   const getNotificationColor = (type: string) => {
//     switch (type) {
//       case 'connection_request':
//         return '#007AFF';
//       case 'connection_accepted':
//         return '#34C759';
//       case 'message':
//         return '#FF9500';
//       case 'follow':
//         return '#5856D6';
//       case 'like':
//         return '#FF3B30';
//       default:
//         return '#8E8E93';
//     }
//   };

//   const renderNotificationItem = ({ item }: { item: any }) => {
//     const isConnectionRequest = item.type === 'connection_request';
//     const isPending = item.connectionId?.status === 'pending';
//     const showActions = isConnectionRequest && isPending && !item.isActioned;
//     const isActionLoading = actionLoading === item._id;

//     return (
//       <TouchableOpacity
//         style={[
//           styles.notificationItem,
//           !item.isRead && styles.unreadNotification,
//         ]}
//         onPress={() => handleNotificationPress(item)}
//         activeOpacity={0.7}
//       >
//         {/* Avatar */}
//         <View style={styles.avatarContainer}>
//           {item.sender?.avatar ? (
//             <Image
//               source={{ uri: item.sender.avatar }}
//               style={styles.avatar}
//             />
//           ) : (
//             <View
//               style={[
//                 styles.avatarPlaceholder,
//                 { backgroundColor: getNotificationColor(item.type) },
//               ]}
//             >
//               <Text style={styles.avatarText}>
//                 {item.sender?.name?.charAt(0)?.toUpperCase() || 'U'}
//               </Text>
//             </View>
//           )}
//           {/* Notification type icon */}
//           <View
//             style={[
//               styles.notificationTypeIcon,
//               { backgroundColor: getNotificationColor(item.type) },
//             ]}
//           >
//             <Ionicons
//               name={getNotificationIcon(item.type)}
//               size={12}
//               color="white"
//             />
//           </View>
//         </View>

//         {/* Content */}
//         <View style={styles.notificationContent}>
//           <Text style={styles.notificationMessage}>
//             <Text style={styles.senderName}>{item.sender?.name} </Text>
//             {item.message}
//           </Text>

//           {item.sender?.headline && (
//             <Text style={styles.senderHeadline} numberOfLines={1}>
//               {item.sender.headline}
//             </Text>
//           )}

//           <Text style={styles.timeAgo}>{getTimeAgo(item.createdAt)}</Text>

//           {/* Accept/Reject Buttons for connection requests */}
//           {showActions && (
//             <View style={styles.actionButtons}>
//               {isActionLoading ? (
//                 <ActivityIndicator
//                   size="small"
//                   color="#007AFF"
//                   style={styles.loadingAction}
//                 />
//               ) : (
//                 <>
//                   <TouchableOpacity
//                     style={styles.acceptButton}
//                     onPress={() =>
//                       handleAccept(item._id, item.connectionId._id, item.sender.name)
//                     }
//                     activeOpacity={0.7}
//                   >
//                     <Ionicons name="checkmark" size={16} color="white" />
//                     <Text style={styles.acceptButtonText}>Accept</Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     style={styles.rejectButton}
//                     onPress={() =>
//                       handleReject(item._id, item.connectionId._id, item.sender.name)
//                     }
//                     activeOpacity={0.7}
//                   >
//                     <Ionicons name="close" size={16} color="white" />
//                     <Text style={styles.rejectButtonText}>Reject</Text>
//                   </TouchableOpacity>
//                 </>
//               )}
//             </View>
//           )}

//           {/* Already actioned status */}
//           {item.isActioned && (
//             <View style={styles.actionedStatus}>
//               <Ionicons
//                 name={
//                   item.connectionId?.status === 'accepted'
//                     ? 'checkmark-circle'
//                     : 'close-circle'
//                 }
//                 size={14}
//                 color={
//                   item.connectionId?.status === 'accepted'
//                     ? '#34C759'
//                     : '#FF3B30'
//                 }
//               />
//               <Text
//                 style={[
//                   styles.actionedText,
//                   {
//                     color:
//                       item.connectionId?.status === 'accepted'
//                         ? '#34C759'
//                         : '#FF3B30',
//                   },
//                 ]}
//               >
//                 {item.connectionId?.status === 'accepted'
//                   ? 'Request Accepted'
//                   : item.connectionId?.status === 'rejected'
//                   ? 'Request Rejected'
//                   : 'Action Taken'}
//               </Text>
//             </View>
//           )}
//         </View>

//         {/* Delete button */}
//         <TouchableOpacity
//           style={styles.deleteButton}
//           onPress={() => handleDelete(item._id)}
//         >
//           <Ionicons name="close" size={18} color="#C7C7CC" />
//         </TouchableOpacity>
//       </TouchableOpacity>
//     );
//   };

//   const renderEmptyList = () => (
//     <View style={styles.emptyContainer}>
//       <Ionicons name="notifications-off" size={64} color="#C7C7CC" />
//       <Text style={styles.emptyTitle}>No Notifications</Text>
//       <Text style={styles.emptySubtitle}>
//         You don't have any notifications yet.{'\n'}
//         They'll appear here when you do.
//       </Text>
//     </View>
//   );

//   const renderFooter = () => {
//     if (!loading || notifications.length === 0) return null;

//     return (
//       <View style={styles.footerLoader}>
//         <ActivityIndicator size="small" color="#007AFF" />
//       </View>
//     );
//   };

//   const filters = [
//     { key: 'all', label: 'All' },
//     { key: 'connection_request', label: 'Requests' },
//     { key: 'connection_accepted', label: 'Accepted' },
//   ];

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <TouchableOpacity onPress={() => router.back()}>
//             <Ionicons name="arrow-back" size={24} color="#007AFF" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Notifications</Text>
//           {unreadCount > 0 && (
//             <View style={styles.unreadBadge}>
//               <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
//             </View>
//           )}
//         </View>

//         <View style={styles.headerRight}>
//           <TouchableOpacity
//             onPress={markAllAsRead}
//             style={styles.headerButton}
//           >
//             <Ionicons name="checkmark-done" size={20} color="#007AFF" />
//             <Text style={styles.headerButtonText}>Read All</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Filter Tabs */}
//       <View style={styles.filterContainer}>
//         {filters.map((filter) => (
//           <TouchableOpacity
//             key={filter.key}
//             style={[
//               styles.filterTab,
//               selectedFilter === filter.key && styles.activeFilterTab,
//             ]}
//             onPress={() => setSelectedFilter(filter.key)}
//           >
//             <Text
//               style={[
//                 styles.filterText,
//                 selectedFilter === filter.key && styles.activeFilterText,
//               ]}
//             >
//               {filter.label}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Notifications List */}
//       {loading && notifications.length === 0 ? (
//         <View style={styles.loaderContainer}>
//           <ActivityIndicator size="large" color="#007AFF" />
//         </View>
//       ) : (
//         <FlatList
//           data={notifications}
//           renderItem={renderNotificationItem}
//           keyExtractor={(item) => item._id}
//           contentContainerStyle={styles.listContent}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={refreshNotifications}
//               tintColor="#007AFF"
//             />
//           }
//           onEndReached={loadMore}
//           onEndReachedThreshold={0.5}
//           ListEmptyComponent={renderEmptyList}
//           ListFooterComponent={renderFooter}
//           showsVerticalScrollIndicator={false}
//         />
//       )}

//       {/* Clear All Button */}
//       {notifications.length > 0 && (
//         <TouchableOpacity
//           style={styles.clearAllButton}
//           onPress={() => {
//             Alert.alert(
//               'Clear All',
//               'Are you sure you want to clear all notifications?',
//               [
//                 { text: 'Cancel', style: 'cancel' },
//                 {
//                   text: 'Clear All',
//                   style: 'destructive',
//                   onPress: () => useNotificationStore.getState().clearAllNotifications(),
//                 },
//               ]
//             );
//           }}
//         >
//           <Ionicons name="trash" size={18} color="#FF3B30" />
//           <Text style={styles.clearAllText}>Clear All</Text>
//         </TouchableOpacity>
//       )}
//       {/* Bottom Navigation Bar */}
//               <BottomNavigationBar />
//     </SafeAreaView>
//   );
// };

const NotificationsScreen = () => {
  const {
    notifications,
    loading,
    refreshing,
    error,
    unreadCount,
    actionLoading,
    pagination,
    fetchNotifications,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    acceptConnectionRequest,
    rejectConnectionRequest,
    deleteNotification,
    loadMore,
    clearError,
  } = useNotificationStore();
  // const { userId } = useAuthStore() as {
  //   userId: string;
  // };
  const userId = useAuthStore((state) => state.userId);
  // useEffect(() => {
  //   fetchNotifications(userId);
  // }, []);
  useEffect(() => {
    if (userId) {
      fetchNotifications(userId);
    }
  }, [userId, fetchNotifications]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [{ text: "OK", onPress: clearError }]);
    }
  }, [error, clearError]);

  // console.log(notifications.length);
  const getTimeAgo = (dateString: string) => {
    return dayjs(dateString).fromNow();
  };

  const handleAccept = (
    notificationId: string,
    connectionId: string,
    senderName: string,
  ) => {
    Alert.alert(
      "Accept Connection",
      `Accept connection request from ${senderName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          onPress: async () => {
            try {
              
              await acceptConnectionRequest(notificationId, connectionId);
              Alert.alert("Success", `You are now connected with ${senderName}!`);
            } catch (error) {
              Alert.alert("Error", "Failed to accept connection request.");
            }
          },
        },
      ],
    );
  };

  const handleReject = (
    notificationId: string,
    connectionId: string,
    senderName: string,
  ) => {
    Alert.alert(
      "Reject Connection",
      `Reject connection request from ${senderName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            try {
              
              await rejectConnectionRequest(notificationId, connectionId);
            } catch (error) {
              Alert.alert("Error", "Failed to reject connection request.");
            }
          },
        },
      ],
    );
  };

  const renderNotificationItem = ({ item }: any) => {
    const isConnectionRequest = item.type === "connection_request";
    const isPending = item.connectionId?.status === "pending";

    const showActions = isConnectionRequest && isPending && !item.isActioned;
    const isActionLoading = actionLoading === item._id;
    // console.log(item._id, item.connectionId._id, item.sender.name);
    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          // !item.isRead && styles.unreadNotification,
        ]}
        // onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        {/* Content */}
        <View style={styles.notificationContent}>
          <Text style={styles.notificationMessage}>
            {/* <Text style={styles.senderName}>{item.sender?.name} </Text> */}

            <Text style={styles.senderName}>@{item.sender?.username} </Text>
            {item.message}
          </Text>
          <Text style={styles.timeAgo}>{getTimeAgo(item.createdAt)}</Text>
          {/* Accept/Reject Buttons for connection requests */}
          {showActions && (
            <View style={styles.actionButtons}>
              {isActionLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#007AFF"
                  style={styles.loadingAction}
                />
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() =>
                      handleAccept(
                        item._id,
                        item.connectionId._id,
                        item.sender.username,
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <Ionicons name="checkmark" size={16} color="white" />
                    <Text style={styles.acceptButtonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() =>
                      handleReject(
                        item._id,
                        item.connectionId._id,
                        item.sender.username,
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close" size={16} color="white" />
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off" size={64} color="#C7C7CC" />
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptySubtitle}>
        You don't have any notifications yet.{"\n"}
        They'll appear here when you do.
      </Text>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshNotifications}
            tintColor="#007AFF"
          />
        }
        // onEndReached={loadMore}
        // onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmptyList}
        // ListFooterComponent={renderFooter}
        // showsVerticalScrollIndicator={false}
      />
      {/* Bottom Navigation Bar */}
      <BottomNavigationBar />
    </SafeAreaView>
  );
};
export default NotificationsScreen;
