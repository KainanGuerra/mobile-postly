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
              title: 'Edit Post',
              headerStyle: { backgroundColor: theme.primary },
              headerTintColor: theme.white,
              headerBackTitleVisible: false,
            }} 
          />
          <Stack.Screen 
            name="create-post" 
            options={{ 
              title: 'Create Post',
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
