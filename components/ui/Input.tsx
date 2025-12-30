// components/ui/Input.tsx
import React from 'react';
import { TextInput, StyleSheet, TextInputProps, useColorScheme, View, StyleProp, ViewStyle, TextStyle, Text, Platform } from 'react-native';
import { Colors } from '@/constants/theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  error?: string;
}

export function Input({ rightIcon, style, inputStyle, error, ...props }: InputProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const styles = StyleSheet.create({
    container: {
      gap: 4,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 50,
      borderColor: error ? theme.cta : theme.border,
      borderWidth: 1,
      borderRadius: 12,
      backgroundColor: theme.white,
      paddingHorizontal: 12,
    },
    input: {
      flex: 1,
      height: '100%',
      color: theme.text,
      fontSize: 16,
      ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any,
    },
    iconContainer: {
      marginLeft: 8,
    },
    errorText: {
      color: theme.cta,
      fontSize: 12,
      marginLeft: 4,
    }
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputContainer}>
        <TextInput 
            placeholderTextColor={theme.icon}
            {...props} 
            style={[styles.input, inputStyle]} 
        />
        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}
