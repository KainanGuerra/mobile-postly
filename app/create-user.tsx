import React, { useState, useEffect } from 'react';
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
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  useEffect(() => {
    if (name.length > 0) {
      const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
      if (!nameRegex.test(name)) {
        setNameError('O nome deve conter apenas letras.');
      } else {
        setNameError('');
      }
    } else {
      setNameError('');
    }
  }, [name]);

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

  const isFormValid = name && email && password && !nameError && !passwordError;

  const handleCreate = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      const result = await createUser(name, email, password, role);
      
      if (result.success) {
        Toast.show({
            type: 'success',
            text1: 'Usuário criado',
            text2: 'O usuário foi criado com sucesso.',
        });
        router.back();
      } else {
        Toast.show({
            type: 'error',
            text1: 'Erro',
            text2: result.message || 'Falha ao criar usuário',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Falha ao criar usuário',
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
                <Text style={[styles.label, { color: theme.text }]}>Nome</Text>
                <Input
                    placeholder="Nome"
                    value={name}
                    onChangeText={setName}
                    error={nameError}
                />
            </View>
            
            <View style={styles.fieldContainer}>
                <Text style={[styles.label, { color: theme.text }]}>E-mail</Text>
                <Input
                    placeholder="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.fieldContainer}>
                <Text style={[styles.label, { color: theme.text }]}>Senha</Text>
                <Input
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    error={passwordError}
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
                <Text style={[styles.label, { color: theme.text }]}>Função</Text>
                <TouchableOpacity 
                    style={[styles.roleSelector, { borderColor: theme.border, backgroundColor: theme.white }]} 
                    onPress={() => setShowDropdown(!showDropdown)}
                >
                    <Text style={[styles.roleValue, { color: theme.text }]}>{role === 'STUDENT' ? 'ALUNO' : 'PROFESSOR'}</Text>
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
                                <Text style={[styles.dropdownItemText, { color: theme.text }]}>{r === 'STUDENT' ? 'ALUNO' : 'PROFESSOR'}</Text>
                                {role === r && <View style={[styles.selectedDot, { backgroundColor: theme.primary }]} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            <View style={{ marginTop: 20, gap: 12 }}>
                <Button 
                    title={isLoading ? "Criando..." : "Criar Usuário"} 
                    onPress={handleCreate} 
                    disabled={isLoading || !isFormValid}
                />
                <Button 
                    title="Cancelar" 
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
