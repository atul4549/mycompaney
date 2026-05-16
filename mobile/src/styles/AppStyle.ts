import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// --- Type Definitions for Styles ---
interface AppStyles {
  safeArea: ViewStyle;
  container: ViewStyle;
  scrollContent: ViewStyle;
  contentWrapper: ViewStyle;
  iconContainer: ViewStyle;
  iconText: TextStyle;
  title: TextStyle;
  subtitle: TextStyle;
  inputContainer: ViewStyle;
  inputLabel: TextStyle;
  textInput: TextStyle;
  button: ViewStyle;
  buttonDisabled: ViewStyle;
  buttonText: TextStyle;
  loader: ViewStyle;
  infoText: TextStyle;
  debugContainer: ViewStyle;
  debugText: TextStyle;
}

const styles = StyleSheet.create<AppStyles>({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  iconText: {
    fontSize: 40,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#cbd5e1',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#334155',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#64748b',
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  loader: {
    marginLeft: 8,
  },
  infoText: {
    marginTop: 32,
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  debugContainer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    width: '100%',
  },
  debugText: {
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
  },
  logo:{
    width: 100,
    height: 100,
    // marginBottom: 24,
  },
  // Add these to your existing styles object
usernameHint: {
  fontSize: 12,
  marginTop: 4,
  marginLeft: 4,
},
usernameAvailable: {
  color: '#10b981',
},
usernameUnavailable: {
  color: '#ef4444',
},
usernameFormatHint: {
  fontSize: 11,
  color: '#64748b',
  marginTop: 4,
  marginLeft: 4,
},
});

export default styles;