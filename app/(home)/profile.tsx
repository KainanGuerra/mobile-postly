// app/(home)/profile.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth, clearAuth } from '@/lib/api';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.name, { color: theme.primary }]}>{user?.name || 'Loading...'}</Text>
      <Text style={[styles.email, { color: theme.text }]}>{user?.email || ''}</Text>
      <View style={{ marginTop: 24, width: '100%', maxWidth: 200 }}>
         <Button title="Logout" onPress={handleLogout} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    marginBottom: 16,
  },
});
