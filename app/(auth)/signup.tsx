// app/(auth)/signup.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, useColorScheme, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Link, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { signUpAPI } from '@/lib/api';
import Toast from 'react-native-toast-message';
import { Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { login } = useAuth();

  useEffect(() => {
    if (name.length > 0) {
      const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
      if (!nameRegex.test(name)) {
        setNameError('O nome deve conter apenas letras.');
      } else {
        setNameError('');
      }
    }
  }, [name]);

  useEffect(() => {
    if (password.length > 0) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;
      if (!passwordRegex.test(password)) {
        setPasswordError('A senha deve conter ao menos uma letra maiúscula, um número e um caractere especial.');
      } else {
        setPasswordError('');
      }
    }
  }, [password]);

  const isFormValid = name && email && password && !nameError && !passwordError;

  const handleSignup = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    const result = await signUpAPI(name, email, password);
    setIsLoading(false);

    if (result.success) {
      if (result.accessToken && result.user) {
         await login(result.user, result.accessToken);
         Toast.show({
            type: 'success',
            text1: 'Bem-vindo!',
            text2: 'Conta criada com sucesso.',
         });
         router.replace('/feed');
      } else {
         Toast.show({
            type: 'success',
            text1: 'Conta criada',
            text2: 'Por favor, faça o login.',
         });
         router.replace('/(auth)/login');
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Falha no Cadastro',
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
        <Text style={[styles.title, { color: theme.primary }]}>Cadastrar</Text>
        <Input
          placeholder="Nome"
          value={name}
          onChangeText={setName}
          error={nameError}
        />
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
          error={passwordError}
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
            title={isLoading ? "Cadastrando..." : "Cadastrar"} 
            onPress={handleSignup} 
            disabled={isLoading || !isFormValid}
        />
        
        <Link href="/(auth)/login" style={styles.link}>
           <Text style={{ color: theme.text }}>Já tem uma conta? <Text style={{ color: theme.action, fontWeight: 'bold' }}>Entrar</Text></Text>
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
