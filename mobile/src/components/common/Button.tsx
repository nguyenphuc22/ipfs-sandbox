import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {ButtonProps} from '../../types';
import {useTheme} from '../../styles';

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  testID,
}) => {
  const {theme} = useTheme();

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];

    switch (variant) {
      case 'primary':
        return [
          ...baseStyle,
          {backgroundColor: theme.colors.primary},
          disabled && {backgroundColor: theme.colors.textSecondary},
        ];
      case 'secondary':
        return [
          ...baseStyle,
          {backgroundColor: theme.colors.surface},
          {borderColor: theme.colors.border, borderWidth: 1},
        ];
      case 'outline':
        return [
          ...baseStyle,
          {backgroundColor: 'transparent'},
          {borderColor: theme.colors.primary, borderWidth: 1},
        ];
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return {color: theme.colors.white};
      case 'secondary':
        return {color: theme.colors.text};
      case 'outline':
        return {color: theme.colors.primary};
      default:
        return {color: theme.colors.text};
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? theme.colors.white : theme.colors.primary}
        />
      ) : (
        <Text style={[styles.text, getTextStyle()]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
