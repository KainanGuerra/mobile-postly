// app/(home)/profile.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, ScrollView } from 'react-native';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth, clearAuth } from '@/lib/api';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);

  useEffect(() => {
    getAuth().then(authString => {
        if (authString) {
            const auth = JSON.parse(authString);
            setUser(auth.user);
        }
    });
  }, []);

  const handleLogout = async () => {
    await clearAuth();
    router.replace('/(auth)/login');
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
                onPress={() => router.push('/change-password')} 
                variant="primary"
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
