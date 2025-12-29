// app/(auth)/login.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, useColorScheme, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Link, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { loginAPI } from '@/lib/api';
import Toast from 'react-native-toast-message';
import { Eye, EyeOff } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing fields',
        text2: 'Please fill in all fields',
      });
      return;
    }

    setIsLoading(true);
    const result = await loginAPI(email, password);
    setIsLoading(false);

    if (result.success) {
      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: 'Login successful.',
      });
      router.replace('/feed');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: result.message,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/logo.svg')}
          style={{ width: 150, height: 50 }}
          contentFit="contain"
        />
      </View>

      <View style={styles.hero}>
        <Image
          source={require('../../assets/hero-illustration.svg')}
          style={{ width: 280, height: 200 }}
          contentFit="contain"
        />
      </View>

      <View style={styles.form}>
        <Text style={[styles.title, { color: theme.primary }]}>Login</Text>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          rightIcon={
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={20} color={theme.icon} />
              ) : (
                <Eye size={20} color={theme.icon} />
              )}
            </TouchableOpacity>
          }
        />
        <Button 
            title={isLoading ? "Logging in..." : "Login"} 
            onPress={handleLogin} 
            disabled={isLoading}
        />
        
        <Link href="/(auth)/signup" style={styles.link}>
          <Text style={{ color: theme.text }}>Don't have an account? <Text style={{ color: theme.action, fontWeight: 'bold' }}>Sign up</Text></Text>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 30,
  },
  form: {
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  link: {
    textAlign: 'center',
    marginTop: 16,
  },
});
