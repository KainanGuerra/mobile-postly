import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LandingPage() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo.svg')}
              style={{ width: 40, height: 40 }}
              contentFit="contain"
            />
            <Text style={[styles.logoTitle, { color: theme.primary }]}>Postly</Text>
          </View>
          <View style={styles.headerRight}>
             <Button 
                title="Entrar" 
                variant="primary" 
                onPress={() => router.push('/(auth)/login')}
                style={{ paddingVertical: 8, paddingHorizontal: 16 }}
             />
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroTextContainer}>
            <Text style={[styles.title, { color: theme.primary }]}>
              Conectando Professores e Alunos de Forma Simples e Interativa
            </Text>
            <Text style={[styles.description, { color: theme.primary }]}>
              A Postly é a plataforma onde professores podem compartilhar conteúdos, 
              ideias e novidades, e alunos podem reagir e comentar em tempo real.
            </Text>
          <View style={styles.heroImageContainer}>
            <Image 
              source={require('../assets/hero-illustration.svg')}
              style={{ width: '100%', height: 300 }}
              contentFit="contain"
            />
          </View>
            <View style={styles.ctaContainer}>
                <Button 
                    title="Saiba mais" 
                    variant="cta" 
                    onPress={() => {}} 
                />
            </View>
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
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
  },
  hero: {
    gap: 32,
  },
  heroTextContainer: {
    gap: 16,
  },
  title: {
    fontSize: 28, // Scaled down slightly from web 2.8rem
    fontWeight: 'bold',
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  ctaContainer: {
      alignItems: 'flex-start'
  },
  heroImageContainer: {
    alignItems: 'center',
    marginTop: 16,
  }
});
