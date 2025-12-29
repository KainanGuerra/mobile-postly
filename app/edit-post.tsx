// app/edit-post.tsx
import React, { useState } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { updatePost } from '@/lib/api';
import Toast from 'react-native-toast-message';

export default function EditPostScreen() {
  const params = useLocalSearchParams();
  const id = params.id as string;
  const initialTitle = params.title as string;
  const initialContent = params.content as string;

  const [title, setTitle] = useState(initialTitle || '');
  const [content, setContent] = useState(initialContent || '');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const handleUpdate = async () => {
    if (!title || !content) {
      Toast.show({
        type: 'error',
        text1: 'Missing fields',
        text2: 'Please fill in both title and content',
      });
      return;
    }

    if (title.trim().length < 3) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Title must be at least 3 characters long.',
      });
      return;
    }

    if (content.trim().length < 10) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Content must be at least 10 characters long.',
      });
      return;
    }

    setIsLoading(true);
    try {
      await updatePost(id, title, content);
      Toast.show({
        type: 'success',
        text1: 'Post updated',
        text2: 'Your post has been updated successfully.',
      });
      router.back();
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update post',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      
      <Input
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      
      <Input
        placeholder="What's on your mind?"
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={4}
        style={{ height: 120 }}
        inputStyle={{ textAlignVertical: 'top', paddingTop: 12 }}
      />
      <Button 
        title={isLoading ? "Updating..." : "Update"} 
        onPress={handleUpdate} 
        disabled={isLoading}
      />
      <Button 
        title="Cancel" 
        variant="white"
        onPress={() => router.back()} 
        style={{ marginTop: 12 }}
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
