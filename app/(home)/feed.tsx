// app/(home)/feed.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, useColorScheme, RefreshControl, ActivityIndicator, TouchableOpacity, Alert, Platform } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPosts, Post as PostType, deletePost } from '@/lib/api';
import { Pencil, Trash, ChevronLeft, ChevronRight } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/contexts/AuthContext';

function Post({ post, currentUser, onDeleteSuccess }: { post: PostType, currentUser: any, onDeleteSuccess: () => void }) {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];
    const router = useRouter();

    const isOwner = currentUser?.id === post.user.id;

    const handleDelete = () => {
        if (Platform.OS === 'web') {
            if (window.confirm("Tem certeza que deseja excluir esta postagem?")) {
                deletePost(post.id).then(success => {
                    if (success) {
                        Toast.show({ type: 'success', text1: 'Postagem excluída' });
                        onDeleteSuccess();
                    } else {
                        Toast.show({ type: 'error', text1: 'Falha ao excluir postagem' });
                    }
                });
            }
        } else {
            Alert.alert(
                "Excluir Postagem",
                "Tem certeza que deseja excluir esta postagem?",
                [
                    { text: "Cancelar", style: "cancel" },
                    { 
                        text: "Excluir", 
                        style: "destructive", 
                        onPress: async () => {
                            const success = await deletePost(post.id);
                            if (success) {
                                Toast.show({ type: 'success', text1: 'Postagem excluída' });
                                onDeleteSuccess();
                            } else {
                                Toast.show({ type: 'error', text1: 'Falha ao excluir postagem' });
                            }
                        }
                    }
                ]
            );
        }
    };

    const handleEdit = () => {
        router.push({
            pathname: '/edit-post',
            params: { id: post.id, title: post.title, content: post.content }
        });
    };

    return (
        <View style={[styles.postContainer, { backgroundColor: theme.white, borderColor: theme.border }]}>
            <View style={styles.postHeader}>
                <View>
                    <Text style={[styles.postAuthor, { color: theme.primary }]}>{post.user.name}</Text>
                    <Text style={[styles.postDate, { color: theme.icon }]}>
                        {new Date(post.createdAt).toLocaleDateString()} {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
                {isOwner && (
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={handleEdit} style={styles.actionButton}>
                            <Pencil size={18} color={theme.action} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
                            <Trash size={18} color={theme.cta} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 18, marginTop: 8 }}>{post.title}</Text>
            <Text style={{ color: theme.text, marginTop: 4 }}>{post.content}</Text>
        </View>
    )
}

function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <View style={styles.paginationContainer}>
            <TouchableOpacity 
                onPress={() => onPageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                style={[styles.pageButton, { opacity: currentPage === 1 ? 0.5 : 1 }]}
            >
                <ChevronLeft size={20} color={theme.text} />
            </TouchableOpacity>

            {getPageNumbers().map(page => (
                <TouchableOpacity
                    key={page}
                    onPress={() => onPageChange(page)}
                    style={[
                        styles.pageNumber,
                        page === currentPage && { backgroundColor: theme.primary }
                    ]}
                >
                    <Text style={[
                        styles.pageText,
                        { color: page === currentPage ? theme.white : theme.text }
                    ]}>
                        {page}
                    </Text>
                </TouchableOpacity>
            ))}

            <TouchableOpacity 
                onPress={() => onPageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                style={[styles.pageButton, { opacity: currentPage === totalPages ? 0.5 : 1 }]}
            >
                <ChevronRight size={20} color={theme.text} />
            </TouchableOpacity>
        </View>
    );
}

export default function FeedScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user: currentUser } = useAuth();

  const fetchPosts = useCallback(async (pageToFetch: number, searchTerm: string) => {
    setLoading(true);
    try {
        const result = await getPosts(pageToFetch, 10, searchTerm);
        setPosts(result.posts);
        setTotalPages(Math.ceil(result.total / 10));
        setPage(pageToFetch);
    } catch (error) {
        console.error("Failed to fetch posts", error);
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts(page, debouncedSearch);
    }, [fetchPosts, page, debouncedSearch])
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
        setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch when debounced search or page changes
  useEffect(() => {
    fetchPosts(page, debouncedSearch);
  }, [debouncedSearch, page, fetchPosts]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts(1, debouncedSearch);
  };

  const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
          fetchPosts(newPage, debouncedSearch);
      }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['left', 'right', 'bottom']}>
      <View style={{ gap: 12, marginBottom: 16 }}>
          <Input 
             placeholder="Pesquisar postagens..." 
             value={search} 
             onChangeText={setSearch} 
             style={{ height: 44 }}
          />
          {currentUser?.role === 'PROFESSOR' && (
             <Button title="Criar Postagem" onPress={() => router.push('/create-post')} />
          )}
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} />
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <Post 
                post={item} 
                currentUser={currentUser} 
                onDeleteSuccess={() => fetchPosts(page, search)} 
            />
          )}
          keyExtractor={(item, index) => item.id + index}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
          }
          ListFooterComponent={
              totalPages > 1 ? (
                  <Pagination 
                      currentPage={page} 
                      totalPages={totalPages} 
                      onPageChange={handlePageChange} 
                  />
              ) : null
          }
          ListEmptyComponent={!loading && <Text style={{ textAlign: 'center', color: theme.text, marginTop: 20 }}>Nenhuma postagem encontrada.</Text>}
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
  postContainer: {
      padding: 16,
      marginBottom: 16,
      borderRadius: 12,
      borderWidth: 1,
      // Shadow for iOS
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      // Elevation for Android
      elevation: 3,
  },
  postHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
  },
  postAuthor: {
      fontWeight: 'bold',
      fontSize: 16,
  },
  postDate: {
      fontSize: 12,
      marginBottom: 4,
  },
  actions: {
      flexDirection: 'row',
      gap: 12,
  },
  actionButton: {
      padding: 4,
  },
  paginationContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      marginTop: 16,
      marginBottom: 32,
  },
  pageButton: {
      padding: 8,
  },
  pageNumber: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
  },
  pageText: {
      fontSize: 14,
      fontWeight: 'bold',
  },
});
