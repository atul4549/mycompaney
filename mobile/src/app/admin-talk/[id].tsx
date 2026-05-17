import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import styles from "./style";
import { useRouter } from "expo-router";
import { useState } from "react";
import Icon from 'react-native-vector-icons/Ionicons';

const Index = () => {
  const router = useRouter();
  const [showParticipants, setShowParticipants] = useState(false);
  
  // Sample participants data - replace with your actual data
  const [participantsList] = useState([
    { id: '1', name: 'Himanshu', isAdmin: true, isOnline: true },
    { id: '2', name: 'Rahul', isAdmin: false, isOnline: true },
    { id: '3', name: 'Priya', isAdmin: false, isOnline: false },
    { id: '4', name: 'Amit', isAdmin: false, isOnline: true },
  ]);
  
  const currentUser = { isAdmin: true, id: '1', name: 'Himanshu' }; // Replace with your actual user data
  
  // ✅ Move this INSIDE the component
  const renderParticipantsModal = () => (
    <View style={styles.participantsModal}>
      <View style={styles.participantsHeader}>
        <Text style={styles.participantsTitle}>
          Participants ({participantsList.length})
        </Text>
        <TouchableOpacity onPress={() => setShowParticipants(false)}>
          <Icon name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={participantsList}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.participantItem}>
            <View style={styles.participantAvatar}>
              <Text style={styles.participantAvatarText}>
                {item.isAdmin ? '👑' : item.name.charAt(0)}
              </Text>
            </View>
            <View style={styles.participantInfo}>
              <Text style={styles.participantName}>
                {item.name}
                {item.isAdmin && <Text style={styles.participantAdminBadge}> (Admin)</Text>}
              </Text>
              <View style={styles.participantStatus}>
                <View style={[styles.statusDot, item.isOnline && styles.statusOnline]} />
                <Text style={styles.statusText}>
                  {item.isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>
            </View>
            {currentUser.isAdmin && !item.isAdmin && (
              <TouchableOpacity onPress={() => handleMuteUser(item.id)}>
                <Icon name="mic-off-outline" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
  
  // Optional: Handle mute user functionality
  const handleMuteUser = (userId) => {
    Alert.alert('Mute User', `Would you like to mute this user?`);
    // Implement mute logic here
  };
  
  // Optional: Open participants modal from header
  const openParticipantsModal = () => {
    setShowParticipants(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openParticipantsModal}>
          <View style={styles.headerInfo}>
            <View style={styles.headerAvatar}>
              <Text style={styles.headerAvatarText}>👑</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>Himanshu Chat Community</Text>
              <Text style={styles.headerSubtitle}>
                {participantsList.length} participants • Admin online
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Icon name="attach-outline" size={24} color="#075E54" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          multiline
        />
      </View>
      
      {/* Participants Modal */}
      {showParticipants && renderParticipantsModal()}
    </KeyboardAvoidingView>
  );
};

export default Index;