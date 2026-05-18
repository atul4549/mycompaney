// // components/ConnectButton.tsx
import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useConnectionStore } from "../stores/useConnectionStore";

// interface ConnectButtonProps {
//   userId: string;
//   username?: string;
// }

// const ConnectButton: React.FC<ConnectButtonProps> = ({ userId, username }) => {
//   const {
//     connectionStatus,
//     loading,
//     error,
//     actionLoading,
//     checkConnectionStatus,
//     sendConnectionRequest,
//     acceptConnectionRequest,
//     rejectConnectionRequest,
//     clearError,
//   } = useConnectionStore();

//   const [isProcessing, setIsProcessing] = useState(false);

//   useEffect(() => {
//     if (userId) {
//       checkConnectionStatus(userId);
//     }
//   }, [userId]);

//   // Show error alert
//   useEffect(() => {
//     if (error) {
//       Alert.alert('Error', error);
//       clearError();
//     }
//   }, [error]);

//   const handleConnect = async () => {
//     try {
//       setIsProcessing(true);
//       await sendConnectionRequest(userId);

//       Alert.alert(
//         'Success',
//         `Connection request sent to ${username || 'user'}!`,
//         [{ text: 'OK' }]
//       );
//     } catch (err) {
//       // Error handled in store
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleAccept = async () => {
//     if (!connectionStatus?._id) return;

//     try {
//       setIsProcessing(true);
//       await acceptConnectionRequest(connectionStatus._id);

//       Alert.alert(
//         'Success',
//         `You are now connected with ${username || 'user'}!`,
//         [{ text: 'OK' }]
//       );
//     } catch (err) {
//       // Error handled in store
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleReject = async () => {
//     if (!connectionStatus?._id) return;

//     Alert.alert(
//       'Reject Request',
//       'Are you sure you want to reject this connection request?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Reject',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               setIsProcessing(true);
//               await rejectConnectionRequest(connectionStatus._id);
//             } catch (err) {
//               // Error handled in store
//             } finally {
//               setIsProcessing(false);
//             }
//           },
//         },
//       ]
//     );
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="small" color="#007AFF" />
//       </View>
//     );
//   }

//   // No connection exists - Show Connect button
//   if (!connectionStatus) {
//     return (
//       <TouchableOpacity
//         style={[styles.button, styles.connectButton]}
//         onPress={handleConnect}
//         disabled={isProcessing || actionLoading}
//         activeOpacity={0.7}
//       >
//         {isProcessing || actionLoading ? (
//           <ActivityIndicator size="small" color="white" />
//         ) : (
//           <>
//             <Ionicons name="person-add" size={18} color="white" />
//             <Text style={styles.connectButtonText}>Connect</Text>
//           </>
//         )}
//       </TouchableOpacity>
//     );
//   }

//   // Pending request sent by current user
//   if (
//     connectionStatus.status === 'pending' &&
//     connectionStatus.requester._id !== userId
//   ) {
//     return (
//       <TouchableOpacity
//         style={[styles.button, styles.pendingButton]}
//         disabled={true}
//       >
//         <Ionicons name="time" size={18} color="#666" />
//         <Text style={styles.pendingButtonText}>Pending</Text>
//       </TouchableOpacity>
//     );
//   }

//   // Pending request received - Show Accept/Reject buttons
//   if (
//     connectionStatus.status === 'pending' &&
//     connectionStatus.requester._id === userId
//   ) {
//     return (
//       <View style={styles.actionContainer}>
//         <TouchableOpacity
//           style={[styles.button, styles.acceptButton]}
//           onPress={handleAccept}
//           disabled={isProcessing || actionLoading}
//           activeOpacity={0.7}
//         >
//           {isProcessing || actionLoading ? (
//             <ActivityIndicator size="small" color="white" />
//           ) : (
//             <>
//               <Ionicons name="checkmark" size={18} color="white" />
//               <Text style={styles.actionButtonText}>Accept</Text>
//             </>
//           )}
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.button, styles.rejectButton]}
//           onPress={handleReject}
//           disabled={isProcessing || actionLoading}
//           activeOpacity={0.7}
//         >
//           <Ionicons name="close" size={18} color="white" />
//           <Text style={styles.actionButtonText}>Reject</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // Already connected
//   if (connectionStatus.status === 'accepted') {
//     return (
//       <TouchableOpacity
//         style={[styles.button, styles.connectedButton]}
//         disabled={true}
//       >
//         <Ionicons name="checkmark-circle" size={18} color="#34C759" />
//         <Text style={styles.connectedButtonText}>Connected</Text>
//       </TouchableOpacity>
//     );
//   }

//   return null;
// };

// const styles = StyleSheet.create({
//   loadingContainer: {
//     padding: 10,
//     alignItems: 'center',
//   },
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 20,
//     gap: 6,
//   },
//   connectButton: {
//     backgroundColor: '#007AFF',
//   },
//   connectButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   pendingButton: {
//     backgroundColor: '#F0F0F0',
//     borderWidth: 1,
//     borderColor: '#DDD',
//   },
//   pendingButtonText: {
//     color: '#666',
//     fontSize: 14,
//     fontWeight: '500',
//   },
//   connectedButton: {
//     backgroundColor: '#F0FFF0',
//     borderWidth: 1,
//     borderColor: '#34C759',
//   },
//   connectedButtonText: {
//     color: '#34C759',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   actionContainer: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   acceptButton: {
//     backgroundColor: '#34C759',
//   },
//   rejectButton: {
//     backgroundColor: '#FF3B30',
//   },
//   actionButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });
const ConnectButton = ({ userId, username }) => {
  // console.log(userId)
  // console.log(username)
  const {
    connectionStatus,
    loading,
    error,
    actionLoading,
    checkConnectionStatus,
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    clearError,
  } = useConnectionStore();
  
// In component
// useEffect(() => {
//   const stopPolling = useConnectionStore
//     .getState()
//     .startPolling(userId, 10000); // Poll every 10 seconds

//   return () => stopPolling();
// }, [userId]);
  if (!connectionStatus) {
    return <Text>connect</Text>;
  }
  // Pending request sent by current user
  if (
    connectionStatus.status === "pending" &&
    connectionStatus.requester._id !== userId
  ) {
    return <Text>pending</Text>;
  }
  // Pending request received - Show Accept/Reject buttons
  if (
    connectionStatus.status === "pending" &&
    connectionStatus.requester._id === userId
  ) {
    return <Text>accept/reject</Text>;
  }
  // Already connected
  if (connectionStatus.status === "accepted") {
    return <Text>Connected</Text>;
  }
  return null;
};

export default ConnectButton;
