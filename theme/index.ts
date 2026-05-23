export const theme = {
  colors: {
    // Brand — swap these two values to repaint the whole app
    primary: '#7b1d1d',
    primaryLight: '#f1948a',
    secondary: '#c0392b',

    // Surfaces
    background: '#fdf5f5',
    surface: '#fff',
    border: '#e8eaf0',

    // Text
    textPrimary: '#1c2833',
    textSecondary: '#7f8c8d',
    textTertiary: '#aab7b8',
    textBody: '#5d6d7e',

    // Semantic — success/error keep their own identity regardless of brand
    success: '#27ae60',
    successDark: '#1e8449',
    successBg: '#eafaf1',
    error: '#e74c3c',
    errorDark: '#c0392b',
    errorBg: '#fdf2f2',

    // Category accents (per-category visual identity, intentionally not brand colors)
    categoryMeals: '#1abc9c',
    categoryMealsBg: '#e8f8f5',
    categoryGarageSales: '#f39c12',
    categoryGarageSalesBg: '#fef9e7',
    categoryActivities: '#c0392b',
    categoryActivitiesBg: '#fce8e8',
  },
} as const;

export type AppTheme = typeof theme;
