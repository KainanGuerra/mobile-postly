// app/edit-user.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, useColorScheme, TouchableOpacity, Alert, Platform } from 'react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { edit } from '@/lib/api';
import Toast from 'react-native-toast-message';
import { ChevronDown } from 'lucide-react-native';

export default function EditUserScreen() {
  const params = useLocalSearchParams();
  const id = params.id as string;
  const initialName = params.name as string;
  const initialEmail = params.email as string;
  const initialRole = params.role as string;

  const [name, setName] = useState(initialName || '');
  const [email, setEmail] = useState(initialEmail || '');
  const [role, setRole] = useState(initialRole || 'STUDENT');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState('');

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

  const isFormValid = name && email && !nameError;

  const handleUpdate = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      await edit(id, { name, role });
      Toast.show({
        type: 'success',
        text1: 'Usuário atualizado',
        text2: 'Os detalhes do usuário foram atualizados com sucesso.',
      });
      router.back();
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Falha ao atualizar usuário',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const roles = ['STUDENT', 'PROFESSOR'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      
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
            editable={false}
            style={{ opacity: 0.6 }}
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

      <View style={{ marginTop: 8, gap: 12 }}>
        <Button 
            title={isLoading ? "Atualizando..." : "Atualizar"} 
            onPress={handleUpdate} 
            disabled={isLoading || !isFormValid}
        />
        <Button 
            title="Cancelar" 
            variant="white"
            onPress={() => router.back()} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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