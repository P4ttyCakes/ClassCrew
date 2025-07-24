import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import 'react-native-reanimated';
import { app as firebaseApp } from '../src/config/firebase';

const ACCENT = 'rgb(91, 134, 197)';
const DARK_BG = '#242428';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showAuth, setShowAuth] = useState(true);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Login/signup form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Typing animation for welcome text
  const welcomeText = 'Welcome to ClassLink';
  const [typedWelcome, setTypedWelcome] = useState('');
  useEffect(() => {
    if (showAuth) {
      setTypedWelcome('');
      let i = 0;
      const interval = setInterval(() => {
        setTypedWelcome((prev) => {
          if (i < welcomeText.length) {
            i++;
            return welcomeText.slice(0, i);
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 60);
      return () => clearInterval(interval);
    }
  }, [showAuth]);

  if (!loaded) {
    return null;
  }

  const handleAuth = async () => {
    setLoading(true);
    setError('');
    const auth = getAuth(firebaseApp);
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setShowAuth(false);
    } catch (err: any) {
      let message = 'Authentication failed';
      let code = '';
      if (typeof err === 'string') {
        code = err;
      } else if (err && typeof err === 'object') {
        code = err.code || err?.code || '';
      }
      console.log('Firebase Auth Error:', code, err?.message || err);
      if (
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential'
      ) {
        message = 'Incorrect email or password.';
      } else if (code === 'auth/email-already-in-use') {
        message = 'This email is already registered.';
      } else if (code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      } else if (code) {
        message = `${code}: ${err?.message || ''}`;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (showAuth) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.authContainer, { backgroundColor: DARK_BG }]}> 
          <Image source={require('../assets/images/Logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.typedWelcome}>{typedWelcome}</Text>
          <Text style={[styles.title, { color: '#fff' }]}>{mode === 'login' ? 'Log In' : 'Sign Up'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#A3A3A3"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#A3A3A3"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Pressable style={[styles.button, loading && { opacity: 0.6 }]} onPress={handleAuth} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Please wait...' : (mode === 'login' ? 'Log In' : 'Sign Up')}</Text>
          </Pressable>
          <Pressable onPress={() => setMode(mode === 'login' ? 'signup' : 'login')} style={styles.switchMode}>
            <Text style={styles.switchModeText}>
              {mode === 'login' ? (
                <>
                  {"Don't have an account? "}
                  <Text style={styles.switchModeTextWhite}>Sign Up</Text>
                </>
              ) : (
                <>
                  {"Already have an account? "}
                  <Text style={styles.switchModeTextWhite}>Log In</Text>
                </>
              )}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    width: '100%', // ensure full width for centering
  },
  logo: {
    width: 400,
    height: 400,
    marginBottom: 2,
    alignSelf: 'center',
    maxWidth: '90%', // responsive for ultrawide
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10, // even tighter
    fontFamily: 'SpaceMono',
    letterSpacing: 1,
  },
  input: {
    width: '90%', // responsive width
    maxWidth: 400,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 30,
    backgroundColor: '#2C2C2E',
    color: '#fff',
    fontSize: 16,
    fontFamily: 'SpaceMono',
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: '#3A3A3C',
    alignSelf: 'center', // center input
  },
  button: {
    backgroundColor: ACCENT,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 30,
    marginTop: 8,
    marginBottom: 12,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
    fontFamily: 'SpaceMono',
  },
  switchMode: {
    marginTop: 8,
  },
  switchModeText: {
    color: ACCENT,
    fontSize: 15,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
  },
  switchModeTextWhite: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'SpaceMono',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 15,
    marginBottom: 10,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
  },
  typedWelcome: {
    color: ACCENT,
    fontSize: 38,
    fontFamily: 'SpaceMono',
    marginBottom: 40, // more space below welcome
    textAlign: 'center',
    letterSpacing: 1,
  },
});
