import React, { useState } from 'react';
import { StyleSheet, View, Text, useColorScheme, TouchableOpacity, ScrollView } from 'react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUser } from '@/lib/api';
import Toast from 'react-native-toast-message';
import { ChevronDown, Eye, EyeOff } from 'lucide-react-native';

export default function CreateUserScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [showPassword, setShowPassword] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const handleCreate = async () => {
    if (!name || !email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing fields',
        text2: 'Please fill in all fields',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await createUser(name, email, password, role);
      
      if (result.success) {
        Toast.show({
            type: 'success',
            text1: 'User created',
            text2: 'User has been created successfully.',
        });
        router.back();
      } else {
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: result.message || 'Failed to create user',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create user',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const roles = ['STUDENT', 'PROFESSOR'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
            <View style={styles.fieldContainer}>
                <Text style={[styles.label, { color: theme.text }]}>Name</Text>
                <Input
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                />
            </View>
            
            <View style={styles.fieldContainer}>
                <Text style={[styles.label, { color: theme.text }]}>Email</Text>
                <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.fieldContainer}>
                <Text style={[styles.label, { color: theme.text }]}>Password</Text>
                <Input
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
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
            </View>

            <View style={styles.fieldContainer}>
                <Text style={[styles.label, { color: theme.text }]}>Role</Text>
                <TouchableOpacity 
                    style={[styles.roleSelector, { borderColor: theme.border, backgroundColor: theme.white }]} 
                    onPress={() => setShowDropdown(!showDropdown)}
                >
                    <Text style={[styles.roleValue, { color: theme.text }]}>{role}</Text>
                    <ChevronDown size={20} color={theme.icon} />
                </TouchableOpacity>

                {showDropdown && (
                    <View style={[styles.dropdownContainer, { backgroundColor: theme.white, borderColor: theme.border }]}>
                        {roles.map((r) => (
                            <TouchableOpacity 
                                key={r} 
                                style={[
                                    styles.dropdownItem, 
                                    { borderBottomColor: theme.border },
                                    role === r && { backgroundColor: theme.action + '20' }
                                ]}
                                onPress={() => {
                                    setRole(r);
                                    setShowDropdown(false);
                                }}
                            >
                                <Text style={[styles.dropdownItemText, { color: theme.text }]}>{r}</Text>
                                {role === r && <View style={[styles.selectedDot, { backgroundColor: theme.primary }]} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            <View style={{ marginTop: 20, gap: 12 }}>
                <Button 
                    title={isLoading ? "Creating..." : "Create User"} 
                    onPress={handleCreate} 
                    disabled={isLoading}
                />
                <Button 
                    title="Cancel" 
                    variant="white"
                    onPress={() => router.back()} 
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
      gap: 20,
  },
  form: {
      gap: 20,
  },
  fieldContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  roleSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 12,
      borderWidth: 1,
      borderRadius: 12,
      height: 50,
  },
  roleValue: {
      fontSize: 16,
      fontWeight: '500',
  },
  dropdownContainer: {
      borderWidth: 1,
      borderRadius: 12,
      marginTop: 8,
      overflow: 'hidden',
  },
  dropdownItem: {
      padding: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
  },
  dropdownItemText: {
      fontSize: 16,
  },
  selectedDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
  }
});
