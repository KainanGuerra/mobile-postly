// app/(home)/profile.tsx
import React from 'react';
import { View, Text, StyleSheet, useColorScheme, ScrollView } from 'react-native';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import Toast from 'react-native-toast-message';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleChangePassword = () => {
    if (user?.role === 'STUDENT') {
      Toast.show({
        type: 'info',
        text1: 'Acesso Restrito',
        text2: 'A alteração de senha não está disponível para alunos.',
      });
      return;
    }
    router.push('/change-password');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
            <Text style={[styles.name, { color: theme.primary }]}>{user?.name || 'Carregando...'}</Text>
            <Text style={[styles.email, { color: theme.text }]}>{user?.email || ''}</Text>
        </View>

        <View style={styles.actions}>
            <Button 
                title="Alterar Senha" 
                onPress={handleChangePassword} 
                variant="primary"
                disabled={user?.role === 'STUDENT'}
            />
            <Button 
                title="Sair" 
                onPress={handleLogout} 
                variant="white" 
            />
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
    alignItems: 'center',
    gap: 40,
  },
  header: {
    alignItems: 'center',
    gap: 4,
    marginTop: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
  },
  actions: {
    width: '100%',
    maxWidth: 300,
    gap: 16,
  }
});
