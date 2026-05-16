// screens/ProfileScreen.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Image,
  Alert,
  Modal,
  Switch,
} from "react-native";
import { AxiosError } from "axios";
import useUserStore, { axiosInstance } from "../stores/useUserStore";
import styles from "../styles/ProfileStyle";
import { ToastProvider, useToast } from '../components/ToastComponent';
import Icon from 'react-native-vector-icons/Ionicons'; // Make sure to install: npm install react-native-vector-icons

// --- Type Definitions ---
interface UserProfile {
  _id: string;
  name: string;
  username: string;
  email?: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
}

interface EditProfileForm {
  name: string;
  bio: string;
  email: string;
}

// --- Main Profile Component ---
const ProfileScreen: React.FC = ({ navigation }: any) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<EditProfileForm>({
    name: '',
    bio: '',
    email: '',
  });
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  
  const { userName, setUserName, logout } = useUserStore() as {
    userName: string;
    setUserName: (name: string) => void;
    logout: () => void;
  };
  
  const toast = useToast();

  // --- Fetch User Profile ---
  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/api/user/profile');
      const userData = response.data.data;
      setProfile(userData);
      
      // Initialize edit form with current data
      setEditForm({
        name: userData.name || '',
        bio: userData.bio || '',
        email: userData.email || '',
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error fetching profile:", axiosError.message);
      toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load profile data',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Update Profile ---
  const handleUpdateProfile = async () => {
    if (!editForm.name.trim()) {
      toast.show({
        type: 'warning',
        text1: 'Name Required',
        text2: 'Please enter your name',
        position: 'top',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.put('/api/user/profile', {
        name: editForm.name.trim(),
        bio: editForm.bio.trim(),
        email: editForm.email.trim(),
      });

      setProfile(response.data.data);
      setUserName(editForm.name.trim());
      setIsEditing(false);
      
      toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Profile updated successfully',
        position: 'bottom',
        visibilityTime: 2000,
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error updating profile:", axiosError.message);
      toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Could not update profile. Please try again.',
        position: 'top',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Change Password ---
  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    if (newPassword.length < 6) {
      toast.show({
        type: 'warning',
        text1: 'Weak Password',
        text2: 'Password must be at least 6 characters',
        position: 'top',
      });
      return false;
    }

    try {
      const response = await axiosInstance.post('/api/user/change-password', {
        oldPassword,
        newPassword,
      });

      toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password changed successfully',
        position: 'bottom',
      });
      return true;
    } catch (error) {
      const axiosError = error as AxiosError;
      toast.show({
        type: 'error',
        text1: 'Error',
        text2: axiosError.response?.data?.message || 'Failed to change password',
        position: 'top',
      });
      return false;
    }
  };

  // --- Delete Account ---
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axiosInstance.delete('/api/user/account');
              toast.show({
                type: 'success',
                text1: 'Account Deleted',
                text2: 'Your account has been deleted',
                position: 'bottom',
              });
              setTimeout(() => {
                logout();
                navigation.replace('Login');
              }, 2000);
            } catch (error) {
              toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete account',
                position: 'top',
              });
            }
          },
        },
      ]
    );
  };

  // --- Logout ---
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity onPress={() => setShowSettings(true)}>
              <Icon name="settings-outline" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Profile Info */}
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Image
                source={
                  profile?.avatar
                    ? { uri: profile.avatar }
                    : require('../assets/images/auth.png')
                }
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editAvatarButton}>
                <Icon name="camera" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.username}>@{profile?.username}</Text>
            <Text style={styles.joinDate}>
              Joined {new Date(profile?.createdAt || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile?.postsCount || 0}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile?.followersCount || 0}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile?.followingCount || 0}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          {/* Edit Mode */}
          {!isEditing ? (
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Icon name="person-outline" size={20} color="#64748b" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>{profile?.name}</Text>
                </View>
              </View>

              {profile?.email && (
                <View style={styles.infoRow}>
                  <Icon name="mail-outline" size={20} color="#64748b" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{profile?.email}</Text>
                  </View>
                </View>
              )}

              <View style={styles.infoRow}>
                <Icon name="document-text-outline" size={20} color="#64748b" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Bio</Text>
                  <Text style={styles.infoValue}>
                    {profile?.bio || 'No bio yet. Tap edit to add one!'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Icon name="create-outline" size={20} color="#3b82f6" />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.editSection}>
              <Text style={styles.editSectionTitle}>Edit Profile</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.name}
                  onChangeText={(text) => setEditForm({ ...editForm, name: text })}
                  placeholder="Your name"
                  placeholderTextColor="#64748b"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={editForm.bio}
                  onChangeText={(text) => setEditForm({ ...editForm, bio: text })}
                  placeholder="Tell us about yourself"
                  placeholderTextColor="#64748b"
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  value={editForm.email}
                  onChangeText={(text) => setEditForm({ ...editForm, email: text })}
                  placeholder="Your email"
                  placeholderTextColor="#64748b"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.editActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => {
                    setIsEditing(false);
                    setEditForm({
                      name: profile?.name || '',
                      bio: profile?.bio || '',
                      email: profile?.email || '',
                    });
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={handleUpdateProfile}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Danger Zone */}
          <View style={styles.dangerZone}>
            <Text style={styles.dangerTitle}>Danger Zone</Text>
            <TouchableOpacity
              style={styles.dangerButton}
              onPress={handleDeleteAccount}
            >
              <Icon name="trash-outline" size={20} color="#ef4444" />
              <Text style={styles.dangerButtonText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Settings</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Icon name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Icon name="notifications-outline" size={24} color="#64748b" />
                  <Text style={styles.settingText}>Push Notifications</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: "#374151", true: "#3b82f6" }}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Icon name="moon-outline" size={24} color="#64748b" />
                  <Text style={styles.settingText}>Dark Mode</Text>
                </View>
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: "#374151", true: "#3b82f6" }}
                />
              </View>

              <TouchableOpacity
                style={styles.settingButton}
                onPress={() => {
                  setShowSettings(false);
                  // Navigate to change password screen or show modal
                  Alert.alert('Change Password', 'Enter your current and new password', [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Change',
                      onPress: () => {
                        // Implement password change logic
                      },
                    },
                  ]);
                }}
              >
                <Icon name="key-outline" size={24} color="#64748b" />
                <Text style={styles.settingText}>Change Password</Text>
                <Icon name="chevron-forward" size={20} color="#64748b" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.settingButton, styles.logoutButton]}
                onPress={handleLogout}
              >
                <Icon name="log-out-outline" size={24} color="#ef4444" />
                <Text style={[styles.settingText, styles.logoutText]}>Logout</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;