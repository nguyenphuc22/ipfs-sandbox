import React from 'react';
import {StyleSheet, View} from 'react-native';
import {CardProps} from '../../types';
import {useTheme} from '../../styles';

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'medium',
  style,
  testID,
}) => {
  const {theme} = useTheme();

  const getPaddingStyle = () => {
    switch (padding) {
      case 'none':
        return {};
      case 'small':
        return {padding: theme.spacing.sm};
      case 'medium':
        return {padding: theme.spacing.md};
      case 'large':
        return {padding: theme.spacing.lg};
      default:
        return {padding: theme.spacing.md};
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
        getPaddingStyle(),
        style,
      ]}
      testID={testID}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
});
