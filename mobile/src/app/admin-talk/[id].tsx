// import React from 'react'
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
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
        //   style={styles.backButton}
        //   onPress={() => router.back()}
        >
          {/* Bach */}
          {/* <Icon name="arrow-back" size={24} color="#fff" /> */}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerInfo}
          //   onPress={() => setShowParticipants(true)}
        >
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>👑</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>{"Himanshu Chat Community"}</Text>
            <Text style={styles.headerSubtitle}>
              {/* {participants} participants  */}• Admin online
            </Text>
          </View>
        </TouchableOpacity>
        {/* <View style={styles.headerActions}>
          {currentUser.isAdmin && (
            <TouchableOpacity 
              style={styles.headerAction}
              onPress={() => setShowAdminTools(!showAdminTools)}
            >
              <Icon name="settings-outline" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.headerAction}>
            <Icon name="call-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View> */}
      </View>
            {/* Admin Tools */}
      {/* {showAdminTools && currentUser.isAdmin && (
        <View style={styles.adminTools}>
          <TouchableOpacity style={styles.adminToolItem} onPress={handleAnnouncement}>
            <Icon name="megaphone-outline" size={20} color="#075E54" />
            <Text style={styles.adminToolText}>Announcement</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.adminToolItem}>
            <Icon name="people-outline" size={20} color="#075E54" />
            <Text style={styles.adminToolText}>Manage Users</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.adminToolItem}>
            <Icon name="stats-chart-outline" size={20} color="#075E54" />
            <Text style={styles.adminToolText}>Analytics</Text>
          </TouchableOpacity>
        </View>
      )} */}
            {/* Typing Indicator */}
      {/* {typingUsers.length > 0 && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </Text>
        </View>
      )} */}
      {/* Messages List */}
      {/* <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      /> */}
      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Icon name="attach-outline" size={24} color="#075E54" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#999"
        //   value={message}
          onChangeText={(text) => {
            // setMessage(text);
            // setIsTyping(text.length > 0);
          }}
          multiline
        />
        
        {/* {message.trim() ? (
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Icon name="send" size={22} color="#075E54" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.micButton}>
            <Icon name="mic-outline" size={24} color="#075E54" />
          </TouchableOpacity>
        )} */}
      </View>
      
      {showParticipants && renderParticipantsModal()}
    </KeyboardAvoidingView>
  );
};
export default Index;

  const renderParticipantsModal = () => (
    <View style={styles.participantsModal}>
      <View style={styles.participantsHeader}>
        <Text style={styles.participantsTitle}>
          Participants
           {/* ({participantsList.length}) */}
        </Text>
        <TouchableOpacity 
        // onPress={() => setShowParticipants(false)}
        >
          {/* <Icon name="close" size={24} color="#000" /> */}
        </TouchableOpacity>
      </View>
      
      {/* <FlatList
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
      /> */}
    </View>
  );
  