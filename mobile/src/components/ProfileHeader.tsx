import { View, Text } from "react-native";
import { useAuthStore } from "../stores/authStore";
import { Image } from "expo-image";
import styles from "../app/auth/profile.styles";
import { formatMemberSince } from "../lib/utils";

export default function ProfileHeader() {
  const { userId, 
    authUser,
    user
   } = useAuthStore()
  // as {
  //   user: {
  //     username: string;
  //     email: string;
  //     profileImage: string;
  //     createdAt: string;
  //   };
  // };
  console.log(userId)
  console.log(user)
  console.log(authUser)
  // if (!user) return null;

  return (
    <View style={styles.profileHeader}>
      {/* <Image source={{ uri: user.profileImage }} style={styles.profileImage} /> */}

      <View style={styles.profileInfo}>
        <Text style={styles.username}>{userId}</Text>
        {/* <Text style={styles.username}>{user.username}</Text> */}
        {/* <Text style={styles.email}>{user.email}</Text> */}
        {/* <Text style={styles.memberSince}>🗓️ Joined {formatMemberSince(user.createdAt)}</Text> */}
      </View>
    </View>
  );
}