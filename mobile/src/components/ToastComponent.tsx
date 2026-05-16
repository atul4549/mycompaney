// import React, { useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Animated,
//   TouchableOpacity,
//   Platform,
// } from 'react-native';

// // Toast Types
// export type ToastType = 'success' | 'error' | 'info' | 'warning';

// // Toast Configuration
// interface ToastConfig {
//   type: ToastType;
//   text1?: string;
//   text2?: string;
//   position?: 'top' | 'bottom';
//   visibilityTime?: number;
//   onHide?: () => void;
// }

// // Toast Context
// interface ToastContextType {
//   show: (config: ToastConfig) => void;
//   hide: () => void;
// }

// export const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

// // Toast Provider Component
// export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [toastConfig, setToastConfig] = React.useState<ToastConfig | null>(null);
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(50)).current;
//   const timeoutRef = useRef<NodeJS.Timeout>();

//   const show = (config: ToastConfig) => {
//     // Clear existing timeout
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//     }

//     setToastConfig(config);
    
//     // Animate in
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Auto hide after visibilityTime
//     timeoutRef.current = setTimeout(() => {
//       hide();
//     }, config.visibilityTime || 3000);
//   };

//   const hide = () => {
//     // Animate out
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//       Animated.timing(slideAnim, {
//         toValue: 50,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//     ]).start(() => {
//       setToastConfig(null);
//       if (toastConfig?.onHide) {
//         toastConfig.onHide();
//       }
//     });
//   };

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//     };
//   }, []);

//   const getToastColors = (type: ToastType) => {
//     switch (type) {
//       case 'success':
//         return {
//           background: '#10b981',
//           icon: '✓',
//           borderColor: '#059669',
//         };
//       case 'error':
//         return {
//           background: '#ef4444',
//           icon: '✕',
//           borderColor: '#dc2626',
//         };
//       case 'warning':
//         return {
//           background: '#f59e0b',
//           icon: '⚠',
//           borderColor: '#d97706',
//         };
//       case 'info':
//       default:
//         return {
//           background: '#3b82f6',
//           icon: 'ℹ',
//           borderColor: '#2563eb',
//         };
//     }
//   };

//   const getPositionStyle = (position?: 'top' | 'bottom') => {
//     if (position === 'top') {
//       return styles.toastTop;
//     }
//     return styles.toastBottom;
//   };

//   if (!toastConfig) {
//     return <>{children}</>;
//   }

//   const colors = getToastColors(toastConfig.type);
//   const positionStyle = getPositionStyle(toastConfig.position);

//   return (
//     <>
//       {children}
//       <Animated.View
//         style={[
//           styles.toastContainer,
//           positionStyle,
//           {
//             opacity: fadeAnim,
//             transform: [{ translateY: slideAnim }],
//             backgroundColor: colors.background,
//             borderLeftColor: colors.borderColor,
//           },
//         ]}
//       >
//         <View style={styles.toastContent}>
//           <View style={[styles.iconContainer, { backgroundColor: colors.borderColor }]}>
//             <Text style={styles.iconText}>{colors.icon}</Text>
//           </View>
//           <View style={styles.textContainer}>
//             {toastConfig.text1 && (
//               <Text style={styles.title} numberOfLines={1}>
//                 {toastConfig.text1}
//               </Text>
//             )}
//             {toastConfig.text2 && (
//               <Text style={styles.message} numberOfLines={2}>
//                 {toastConfig.text2}
//               </Text>
//             )}
//           </View>
//           <TouchableOpacity onPress={hide} style={styles.closeButton}>
//             <Text style={styles.closeText}>✕</Text>
//           </TouchableOpacity>
//         </View>
//       </Animated.View>
//     </>
//   );
// };

// // Custom Hook for using Toast
// export const useToast = () => {
//   const context = React.useContext(ToastContext);
//   if (!context) {
//     throw new Error('useToast must be used within a ToastProvider');
//   }
//   return context;
// };

// // Styles
// const styles = StyleSheet.create({
//   toastContainer: {
//     position: 'absolute',
//     left: 16,
//     right: 16,
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderLeftWidth: 4,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//       },
//       android: {
//         elevation: 5,
//       },
//     }),
//   },
//   toastTop: {
//     top: Platform.OS === 'ios' ? 50 : 30,
//   },
//   toastBottom: {
//     bottom: 30,
//   },
//   toastContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   iconContainer: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   iconText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   textContainer: {
//     flex: 1,
//   },
//   title: {
//     color: '#ffffff',
//     fontSize: 15,
//     fontWeight: '600',
//     marginBottom: 2,
//   },
//   message: {
//     color: '#ffffff',
//     fontSize: 13,
//     opacity: 0.9,
//   },
//   closeButton: {
//     width: 24,
//     height: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 8,
//   },
//   closeText: {
//     color: '#ffffff',
//     fontSize: 14,
//     fontWeight: '600',
//     opacity: 0.8,
//   },
// });

// // Standalone Toast Component (if you don't want to use Context)
// interface StandaloneToastProps {
//   visible: boolean;
//   config: ToastConfig;
//   onHide: () => void;
// }

// export const StandaloneToast: React.FC<StandaloneToastProps> = ({
//   visible,
//   config,
//   onHide,
// }) => {
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(50)).current;

//   useEffect(() => {
//     if (visible) {
//       Animated.parallel([
//         Animated.timing(fadeAnim, {
//           toValue: 1,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//         Animated.timing(slideAnim, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//       ]).start();

//       const timeout = setTimeout(() => {
//         onHide();
//       }, config.visibilityTime || 3000);

//       return () => clearTimeout(timeout);
//     } else {
//       Animated.parallel([
//         Animated.timing(fadeAnim, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//         Animated.timing(slideAnim, {
//           toValue: 50,
//           duration: 300,
//           useNativeDriver: true,
//         }),
//       ]).start();
//     }
//   }, [visible]);

//   const getToastColors = (type: ToastType) => {
//     switch (type) {
//       case 'success':
//         return { background: '#10b981', icon: '✓' };
//       case 'error':
//         return { background: '#ef4444', icon: '✕' };
//       case 'warning':
//         return { background: '#f59e0b', icon: '⚠' };
//       default:
//         return { background: '#3b82f6', icon: 'ℹ' };
//     }
//   };

//   if (!visible) return null;

//   const colors = getToastColors(config.type);

//   return (
//     <Animated.View
//       style={[
//         styles.toastContainer,
//         styles.toastBottom,
//         {
//           opacity: fadeAnim,
//           transform: [{ translateY: slideAnim }],
//           backgroundColor: colors.background,
//         },
//       ]}
//     >
//       <View style={styles.toastContent}>
//         <View style={styles.iconContainer}>
//           <Text style={styles.iconText}>{colors.icon}</Text>
//         </View>
//         <View style={styles.textContainer}>
//           {config.text1 && <Text style={styles.title}>{config.text1}</Text>}
//           {config.text2 && <Text style={styles.message}>{config.text2}</Text>}
//         </View>
//         <TouchableOpacity onPress={onHide} style={styles.closeButton}>
//           <Text style={styles.closeText}>✕</Text>
//         </TouchableOpacity>
//       </View>
//     </Animated.View>
//   );
// };

// ToastComponent.tsx
import React, { createContext, useContext, useRef, ReactNode } from 'react';
import Toast, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';

// Define toast types
export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  type: ToastType;
  text1: string;
  text2?: string;
  position?: 'top' | 'bottom';
  visibilityTime?: number;
  autoHide?: boolean;
}

interface ToastContextType {
  show: (options: ToastOptions) => void;
  hide: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#10b981', backgroundColor: '#ffffff' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
      }}
      text2Style={{
        fontSize: 14,
        color: '#6b7280',
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#ef4444', backgroundColor: '#ffffff' }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
      }}
      text2Style={{
        fontSize: 14,
        color: '#6b7280',
      }}
    />
  ),
  warning: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#f59e0b', backgroundColor: '#ffffff' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
      }}
      text2Style={{
        fontSize: 14,
        color: '#6b7280',
      }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#3b82f6', backgroundColor: '#ffffff' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
      }}
      text2Style={{
        fontSize: 14,
        color: '#6b7280',
      }}
    />
  ),
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const toastRef = useRef<any>();

  const show = (options: ToastOptions) => {
    Toast.show({
      type: options.type,
      text1: options.text1,
      text2: options.text2,
      position: options.position || 'bottom',
      visibilityTime: options.visibilityTime || 3000,
      autoHide: options.autoHide !== false,
    });
  };

  const hide = () => {
    Toast.hide();
  };

  return (
    <ToastContext.Provider value={{ show, hide }}>
      {children}
      <Toast ref={toastRef} config={toastConfig} />
    </ToastContext.Provider>
  );
};