// import { Text } from 'react-native';
// import styles from "@/styles/AppStyle";
// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="index" />
//     </Stack>
//   );
// }

// app/_layout.tsx
import { Tabs } from "expo-router";
import { Image, StatusBar, Text } from "react-native";
import logo from '../assets/images/logo.png';
import { ToastProvider } from "@/components/ToastComponent";

export default function RootLayout() {
  return (
    <>
    <ToastProvider>

      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#1e293b',
            borderTopColor: '#334155',
          //   height: 60,
          //   paddingBottom: 8,
          //   paddingTop: 8,
          },
          tabBarActiveTintColor: '#3b82f6',
          tabBarInactiveTintColor: '#94a3b8',
          tabBarLabelStyle: {
            // fontSize: 12,
            // fontWeight: '500',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "",
            tabBarIcon: ({ focused, color, size }) => (
              // You can use custom icons here
              <Text style={{ fontSize: size, color }}>
                <Image source={logo} style={{
                  width: 50,
                  height: 50,
                  // tintColor: color,
                }} />
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="UserList"
          options={{
            title: "",
            tabBarIcon: ({ focused, color, size }) => (
              // You can use custom icons here
              <Text style={{ fontSize: size, color }}>
                
                👥
                </Text>
            ),
          }}
          />
      </Tabs>
          </ToastProvider>
    </ >
  );
}

// Need to import Text for the icons

// import styles from "@/styles/AppStyle";
