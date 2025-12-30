// app/create-post.tsx
import React, { useState } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createPost } from '@/lib/api';
import Toast from 'react-native-toast-message';

export default function CreatePostScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const handlePost = async () => {
    if (!title || !content) {
      Toast.show({
        type: 'error',
        text1: 'Campos ausentes',
        text2: 'Por favor, preencha o título e o conteúdo',
      });
      return;
    }

    if (title.trim().length < 3) {
      Toast.show({
        type: 'error',
        text1: 'Erro de Validação',
        text2: 'O título deve ter pelo menos 3 caracteres.',
      });
      return;
    }

    if (content.trim().length < 10) {
      Toast.show({
        type: 'error',
        text1: 'Erro de Validação',
        text2: 'O conteúdo deve ter pelo menos 10 caracteres.',
      });
      return;
    }

    setIsLoading(true);
    try {
      await createPost(title, content);
      Toast.show({
        type: 'success',
        text1: 'Postagem criada',
        text2: 'Sua postagem foi compartilhada com sucesso.',
      });
      router.back();
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Falha ao criar postagem',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      
      <Input
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      
      <Input
        placeholder="No que você está pensando?"
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={4}
        style={{ height: 120 }}
        inputStyle={{ textAlignVertical: 'top', paddingTop: 12 }}
      />
      <Button 
        title={isLoading ? "Postando..." : "Postar"} 
        onPress={handlePost} 
        disabled={isLoading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
});
