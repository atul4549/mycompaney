// components/BottomNavigationBar.tsx
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter, usePathname } from 'expo-router';

const BottomNavigationBar = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get current route

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };
  
  return (
    <View style={styles.bottomNav}>
      {/* Chats Tab */}
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => router.push('/')}
      >
        <Icon 
          name="chatbubbles" 
          size={24} 
          color={isActive('/') ? '#075E54' : '#999'} 
        />
        <Text style={[styles.navText, isActive('/') && styles.navTextActive]}>
          Chats
        </Text>
      </TouchableOpacity>

      {/* Users Tab */}
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => router.push('/UserList')}
      >
        <Icon 
          name="people-outline" 
          size={24} 
          color={isActive('/UserList') ? '#075E54' : '#999'} 
        />
        <Text style={[styles.navText, isActive('/UserList') && styles.navTextActive]}>
          Users
        </Text>
      </TouchableOpacity>

      {/* Notifications Tab */}
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => router.push('/Notifications')}
      >
        <Icon 
          name="notifications-outline" 
          size={24} 
          color={isActive('/notifications') ? '#075E54' : '#999'} 
        />
        <Text style={[styles.navText, isActive('/notifications') && styles.navTextActive]}>
          Alerts
        </Text>
      </TouchableOpacity>

      {/* Profile Tab */}
      <TouchableOpacity 
        style={styles.navItem}
        onPress={() => router.push('/auth/profile')}  // Changed to '/profile'
      >
        <Icon 
          name="person-circle-outline" 
          size={24} 
          color={isActive('/profile') ? '#075E54' : '#999'} 
        />
        <Text style={[styles.navText, isActive('/profile') && styles.navTextActive]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigationBar;

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    paddingBottom: 20, // Extra padding for iPhone notch
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  navText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontWeight: '500',
  },
  navTextActive: {
    color: '#075E54',
    fontWeight: 'bold',
  },
});