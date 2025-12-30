// app/_layout.tsx
import { Stack, useRouter, useSegments } from 'expo-router';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import Toast from 'react-native-toast-message';
import { Colors } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

function RootLayoutNav() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { isAuthenticated, isLoading, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isChangePassword = segments[0] === 'change-password';

    if (!isAuthenticated && !inAuthGroup && segments[0] !== undefined) {
      // Redirect to login if not authenticated and not in auth group
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to feed if authenticated and in auth group
      router.replace('/feed');
    } else if (isAuthenticated && isChangePassword && user?.role === 'STUDENT') {
      // Prevent STUDENT from accessing change-password
      router.replace('/profile');
    }
  }, [isAuthenticated, segments, isLoading, user]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(home)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="edit-post" 
            options={{ 
              title: 'Editar Postagem',
              headerStyle: { backgroundColor: theme.primary },
              headerTintColor: theme.white,
              headerBackTitleVisible: false,
            }} 
          />
          <Stack.Screen 
            name="create-post" 
            options={{ 
              title: 'Criar Postagem',
              headerStyle: { backgroundColor: theme.primary },
              headerTintColor: theme.white,
              headerBackTitleVisible: false,
            }} 
          />
          <Stack.Screen 
            name="edit-user" 
            options={{ 
              title: 'Editar Usuário',
              headerStyle: { backgroundColor: theme.primary },
              headerTintColor: theme.white,
              headerBackTitleVisible: false,
            }} 
          />
          <Stack.Screen 
            name="create-user" 
            options={{ 
              title: 'Criar Usuário',
              headerStyle: { backgroundColor: theme.primary },
              headerTintColor: theme.white,
              headerBackTitleVisible: false,
            }} 
          />
          <Stack.Screen 
            name="change-password" 
            options={{ 
              title: 'Alterar Senha',
              headerStyle: { backgroundColor: theme.primary },
              headerTintColor: theme.white,
              headerBackTitleVisible: false,
            }} 
          />
        </Stack>
        <Toast />
      </>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
