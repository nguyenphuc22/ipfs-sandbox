import {ViewStyle, TextStyle} from 'react-native';

export interface BaseComponentProps {
  style?: ViewStyle;
  testID?: string;
}

export interface TextComponentProps extends BaseComponentProps {
  children: React.ReactNode;
  style?: TextStyle;
  numberOfLines?: number;
}

export interface ButtonProps extends BaseComponentProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
}

export interface CardProps extends BaseComponentProps {
  children: React.ReactNode;
  padding?: 'none' | 'small' | 'medium' | 'large';
}
