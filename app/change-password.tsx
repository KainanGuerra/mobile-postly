// app/change-password.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth, edit } from '@/lib/api';
import Toast from 'react-native-toast-message';
import { Eye, EyeOff } from 'lucide-react-native';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  useEffect(() => {
    getAuth().then(authString => {
        if (authString) {
            const auth = JSON.parse(authString);
            setUser(auth.user);
        }
    });
  }, []);

  useEffect(() => {
    if (password.length > 0) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;
      if (!passwordRegex.test(password)) {
        setPasswordError('A senha deve conter ao menos uma letra maiúscula, um número e um caractere especial.');
      } else {
        setPasswordError('');
      }
    } else {
      setPasswordError('');
    }
  }, [password]);

  useEffect(() => {
    if (confirmPassword.length > 0 && password !== confirmPassword) {
      setConfirmPasswordError('As senhas não coincidem.');
    } else {
      setConfirmPasswordError('');
    }
  }, [confirmPassword, password]);

  const isFormValid = password && confirmPassword && !passwordError && !confirmPasswordError;

  const handleChangePassword = async () => {
    if (!isFormValid) return;

    if (!user?.id) {
        Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: 'Sessão do usuário não encontrada.',
        });
        return;
    }

    setIsUpdating(true);
    try {
      await edit(user.id, { password });
      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Senha atualizada com sucesso.',
      });
      router.back();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Falha ao atualizar a senha.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
            <View style={styles.fieldContainer}>
                <Text style={[styles.label, { color: theme.text }]}>Nova Senha</Text>
                <Input
                    placeholder="Digite a nova senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    error={passwordError}
                    rightIcon={
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={20} color={theme.icon} /> : <Eye size={20} color={theme.icon} />}
                        </TouchableOpacity>
                    }
                />
            </View>

            <View style={styles.fieldContainer}>
                <Text style={[styles.label, { color: theme.text }]}>Confirmar Nova Senha</Text>
                <Input
                    placeholder="Confirme a nova senha"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    error={confirmPasswordError}
                    rightIcon={
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <EyeOff size={20} color={theme.icon} /> : <Eye size={20} color={theme.icon} />}
                        </TouchableOpacity>
                    }
                />
            </View>

            <View style={{ marginTop: 8, gap: 12 }}>
                <Button 
                    title={isUpdating ? "Atualizando..." : "Atualizar Senha"} 
                    onPress={handleChangePassword} 
                    disabled={isUpdating || !isFormValid}
                    variant="primary"
                />
                <Button 
                    title="Cancelar" 
                    onPress={() => router.back()} 
                    variant="white"
                    disabled={isUpdating}
                />
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 32,
  },
  form: {
    width: '100%',
    gap: 16,
  },
  fieldContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
});