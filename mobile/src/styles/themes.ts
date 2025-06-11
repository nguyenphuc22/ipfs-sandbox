import {Theme} from '../types/theme';
import {COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS} from '../constants';

export const lightTheme: Theme = {
  colors: {
    primary: COLORS.PRIMARY,
    background: COLORS.BACKGROUND_LIGHT,
    surface: COLORS.SURFACE_LIGHT,
    text: COLORS.TEXT_PRIMARY_LIGHT,
    textSecondary: COLORS.TEXT_SECONDARY_LIGHT,
    border: COLORS.BORDER_LIGHT,
    success: COLORS.SUCCESS,
    warning: COLORS.WARNING,
    error: COLORS.ERROR,
    white: COLORS.WHITE,
    black: COLORS.BLACK,
  },
  spacing: {
    xs: SPACING.XS,
    sm: SPACING.SM,
    md: SPACING.MD,
    lg: SPACING.LG,
    xl: SPACING.XL,
    xxl: SPACING.XXL,
  },
  typography: {
    title: {
      fontSize: TYPOGRAPHY.SIZE.XXXL,
      fontWeight: TYPOGRAPHY.WEIGHT.BOLD,
    },
    subtitle: {
      fontSize: TYPOGRAPHY.SIZE.MD,
      fontWeight: TYPOGRAPHY.WEIGHT.REGULAR,
    },
    body: {
      fontSize: TYPOGRAPHY.SIZE.MD,
      fontWeight: TYPOGRAPHY.WEIGHT.REGULAR,
    },
    caption: {
      fontSize: TYPOGRAPHY.SIZE.SM,
      fontWeight: TYPOGRAPHY.WEIGHT.REGULAR,
    },
  },
  borderRadius: {
    sm: BORDER_RADIUS.SM,
    md: BORDER_RADIUS.MD,
    lg: BORDER_RADIUS.LG,
  },
};

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    primary: COLORS.PRIMARY_DARK,
    background: COLORS.BACKGROUND_DARK,
    surface: COLORS.SURFACE_DARK,
    text: COLORS.TEXT_PRIMARY_DARK,
    textSecondary: COLORS.TEXT_SECONDARY_DARK,
    border: COLORS.BORDER_DARK,
    success: COLORS.SUCCESS,
    warning: COLORS.WARNING,
    error: COLORS.ERROR,
    white: COLORS.WHITE,
    black: COLORS.BLACK,
  },
};
