// app/_layout.tsx
import { Stack } from 'expo-router';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import Toast from 'react-native-toast-message';
import { Colors } from '@/constants/theme';

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

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
                    />        </Stack>
        <Toast />
      </>
    </ThemeProvider>
  );
}
