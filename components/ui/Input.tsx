// components/ui/Input.tsx
import React from 'react';
import { TextInput, StyleSheet, TextInputProps, useColorScheme, View, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '@/constants/theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export function Input({ rightIcon, style, inputStyle, ...props }: InputProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 50,
      borderColor: theme.border,
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
    },
    iconContainer: {
      marginLeft: 8,
    }
  });

  return (
    <View style={[styles.container, style]}>
      <TextInput 
        placeholderTextColor={theme.icon}
        {...props} 
        style={[styles.input, inputStyle]} 
      />
      {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
    </View>
  );
}
