// app/(auth)/login.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, useColorScheme, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { loginAPI } from '@/lib/api';
import Toast from 'react-native-toast-message';
import { Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Campos ausentes',
        text2: 'Por favor, preencha todos os campos',
      });
      return;
    }

    setIsLoading(true);
    const result = await loginAPI(email, password);
    setIsLoading(false);

    if (result.success && result.user && result.accessToken) {
      await login(result.user, result.accessToken);
      Toast.show({
        type: 'success',
        text1: 'Bem-vindo de volta!',
        text2: 'Login realizado com sucesso.',
      });
      router.replace('/feed');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Falha no Login',
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
        <Text style={[styles.title, { color: theme.primary }]}>Entrar</Text>
        <Input
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          placeholder="Senha"
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
            title={isLoading ? "Entrando..." : "Entrar"} 
            onPress={handleLogin} 
            disabled={isLoading}
        />

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
    marginBottom: 8,
    textAlign: 'center',
  },
  link: {
    textAlign: 'center',
    marginTop: 16,
  },
});
