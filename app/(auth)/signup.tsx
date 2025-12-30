// app/(auth)/signup.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, useColorScheme, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Link, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { signUpAPI } from '@/lib/api';
import Toast from 'react-native-toast-message';
import { Eye, EyeOff } from 'lucide-react-native';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const handleSignup = async () => {
    if (!name || !email || !password) {
       Toast.show({
        type: 'error',
        text1: 'Missing fields',
        text2: 'Please fill in all fields',
       });
       return;
    }

    setIsLoading(true);
    const result = await signUpAPI(name, email, password);
    setIsLoading(false);

    if (result.success) {
      if (result.accessToken) {
         Toast.show({
            type: 'success',
            text1: 'Welcome!',
            text2: 'Account created successfully.',
         });
         router.replace('/feed');
      } else {
         Toast.show({
            type: 'success',
            text1: 'Account created',
            text2: 'Please log in.',
         });
         router.replace('/(auth)/login');
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Sign Up Failed',
        text2: result.message,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.svg')}
            style={{ width: 40, height: 40 }}
            contentFit="contain"
          />
          <Text style={[styles.logoTitle, { color: theme.primary }]}>Postly</Text>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={[styles.title, { color: theme.primary }]}>Sign Up</Text>
        <Input
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
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
            title={isLoading ? "Signing Up..." : "Sign Up"} 
            onPress={handleSignup} 
            disabled={isLoading}
        />
        
        <Link href="/(auth)/login" style={styles.link}>
           <Text style={{ color: theme.text }}>Already have an account? <Text style={{ color: theme.action, fontWeight: 'bold' }}>Log in</Text></Text>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    gap: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  link: {
    textAlign: 'center',
    marginTop: 16,
  },
});
