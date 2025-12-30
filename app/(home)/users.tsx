// app/(home)/users.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, useColorScheme, RefreshControl, ActivityIndicator, TouchableOpacity, Alert, Platform } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUsers, removeUser } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Pencil, Trash } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

function UserItem({ user, onDeleteSuccess }: { user: User, onDeleteSuccess: () => void }) {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const router = useRouter();

        const handleDelete = () => {
            if (Platform.OS === 'web') {
                if (window.confirm(`Tem certeza que deseja remover o usuário ${user.name}?`)) {
                    removeUser(user.id).then(success => {
                        if (success) {
                            Toast.show({ type: 'success', text1: 'Usuário removido' });
                            onDeleteSuccess();
                        } else {
                            Toast.show({ type: 'error', text1: 'Falha ao remover usuário' });
                        }
                    });
                }
            } else {
                Alert.alert(
                    "Remover Usuário",
                    `Tem certeza que deseja remover o usuário ${user.name}?`,
                    [
                        { text: "Cancelar", style: "cancel" },
                        {
                            text: "Remover",
                            style: "destructive",
                            onPress: async () => {
                                const success = await removeUser(user.id);
                                if (success) {
                                    Toast.show({ type: 'success', text1: 'Usuário removido' });
                                    onDeleteSuccess();
                                } else {
                                    Toast.show({ type: 'error', text1: 'Falha ao remover usuário' });
                                }
                            }
                        }
                    ]
                );
            }
        };
    const handleEdit = () => {
        router.push({
            pathname: '/edit-user',
            params: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    };

    return (
        <View style={[styles.userContainer, { backgroundColor: theme.white, borderColor: theme.border }]}>
            <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: theme.primary }]}>{user.name}</Text>
                <Text style={[styles.userEmail, { color: theme.text }]}>{user.email}</Text>
                <Text style={[styles.userRole, { color: theme.icon }]}>{user.role}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
                    <Pencil size={20} color={theme.action} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
                    <Trash size={20} color={theme.cta} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default function UsersScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [emailFilter, setEmailFilter] = useState('');
  const [debouncedEmail, setDebouncedEmail] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>(''); // '' = All

  const fetchUsers = useCallback(async (currentEmail: string, currentRole: string) => {
    setLoading(true);
    try {
        const result = await getUsers({ email: currentEmail, role: currentRole });
        setUsers(result);
    } catch (error) {
        console.error("Failed to fetch users", error);
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
  }, []);

  // Fetch on focus
  useFocusEffect(
    useCallback(() => {
      fetchUsers(debouncedEmail, roleFilter);
    }, [fetchUsers, debouncedEmail, roleFilter])
  );

  // Debounce email filter
  useEffect(() => {
    const timer = setTimeout(() => {
        setDebouncedEmail(emailFilter);
    }, 500);
    return () => clearTimeout(timer);
  }, [emailFilter]);

  // Fetch when debounced email or role changes
  useEffect(() => {
    fetchUsers(debouncedEmail, roleFilter);
  }, [debouncedEmail, roleFilter, fetchUsers]);


  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers(debouncedEmail, roleFilter);
  };

  const roles = [
      { label: 'Todos', value: '' },
      { label: 'Alunos', value: 'STUDENT' },
      { label: 'Professores', value: 'PROFESSOR' }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.primary }]}>Usuários</Text>
        <Button 
            title="Create New User" 
            onPress={() => router.push('/create-user')}
        />
      </View>

      <View style={styles.filtersContainer}>
          <Input 
             placeholder="Buscar por email..." 
             value={emailFilter} 
             onChangeText={setEmailFilter} 
             autoCapitalize="none"
             style={{ height: 44 }}
          />
          <View style={styles.roleFilters}>
              {roles.map((r) => (
                  <TouchableOpacity
                    key={r.label}
                    onPress={() => setRoleFilter(r.value)}
                    style={[
                        styles.roleChip,
                        { 
                            backgroundColor: roleFilter === r.value ? theme.primary : theme.white,
                            borderColor: theme.border,
                            borderWidth: roleFilter === r.value ? 0 : 1
                        }
                    ]}
                  >
                      <Text style={{ 
                          color: roleFilter === r.value ? theme.white : theme.text,
                          fontWeight: roleFilter === r.value ? 'bold' : 'normal'
                      }}>
                          {r.label}
                      </Text>
                  </TouchableOpacity>
              ))}
          </View>
      </View>

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color={theme.primary} />
      ) : (
        <FlatList
          data={users}
          renderItem={({ item }) => (
            <UserItem 
                user={item}
                onDeleteSuccess={fetchUsers} 
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
          }
          ListEmptyComponent={!loading && <Text style={{ textAlign: 'center', color: theme.text, marginTop: 20 }}>No users found.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  filtersContainer: {
      gap: 12,
      marginBottom: 16,
  },
  roleFilters: {
      flexDirection: 'row',
      gap: 8,
  },
  roleChip: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
  },
  userContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      marginBottom: 12,
      borderRadius: 12,
      borderWidth: 1,
      // Shadow
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
  },
  userInfo: {
      flex: 1,
  },
  userName: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 4,
  },
  userEmail: {
      fontSize: 14,
      marginBottom: 2,
  },
  userRole: {
      fontSize: 12,
      fontStyle: 'italic',
  },
  actions: {
      flexDirection: 'row',
      gap: 12,
      marginLeft: 16,
  },
  actionButton: {
      padding: 8,
  },
});
