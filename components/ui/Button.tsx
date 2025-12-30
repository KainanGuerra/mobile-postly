// components/ui/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, useColorScheme, Platform } from 'react-native';
import { Colors } from '@/constants/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'action' | 'cta' | 'white';
}

export function Button({ title, variant = 'action', ...props }: ButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  let backgroundColor;
  let textColor = theme.white;
  let borderWidth = 0;

  switch (variant) {
    case 'primary':
      backgroundColor = theme.primary;
      break;
    case 'cta':
      backgroundColor = theme.cta;
      break;
    case 'white':
      backgroundColor = theme.white;
      textColor = theme.text;
      borderWidth = 1;
      break;
    case 'action':
    default:
      backgroundColor = theme.action;
      break;
  }

  const styles = StyleSheet.create({
    button: {
      backgroundColor: backgroundColor,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: borderWidth,
      borderColor: theme.border,
      opacity: props.disabled ? 0.6 : 1,
      ...(Platform.OS === 'web' ? { 
        outlineStyle: 'none',
        cursor: props.disabled ? 'not-allowed' : 'pointer'
      } : {}) as any,
    },
    buttonText: {
      color: textColor,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <TouchableOpacity {...props} style={[styles.button, props.style]}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}
