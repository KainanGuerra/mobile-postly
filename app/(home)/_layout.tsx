// app/(home)/_layout.tsx
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme, TouchableOpacity, View, Text } from 'react-native';
import { Colors } from '@/constants/theme';
import { LogOut } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { getAuth, clearAuth } from '@/lib/api';

export default function HomeLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const router = useRouter();
  const [isProfessor, setIsProfessor] = useState(false);

  useEffect(() => {
      getAuth().then(authString => {
          if (authString) {
              const user = JSON.parse(authString).user;
              if (user?.role === 'PROFESSOR') {
                  setIsProfessor(true);
              }
          }
      });
  }, []);

  const handleLogout = async () => {
    await clearAuth();
    router.replace('/(auth)/login');
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tabIconSelected,
        tabBarInactiveTintColor: theme.tabIconDefault,
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: theme.white,
                headerTitleAlign: 'left',
        headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Image 
                    source={require('../../assets/logo.svg')}
                    style={{ width: 40, height: 40 }}
                    contentFit="contain"
                />
                <Text style={{ color: theme.white, fontSize: 20, fontWeight: 'bold' }}>Postly</Text>
            </View>
        ),
        headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
              <LogOut size={22} color={theme.white} />
            </TouchableOpacity>
        ),
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
        },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Usuários',
          href: isProfessor ? undefined : null,
          tabBarIcon: ({ color, size }) => <Ionicons name="people" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
