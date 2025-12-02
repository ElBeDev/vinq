// Zoho CRM Color Palette
export const colors = {
  // Primary Colors (Zoho Blue)
  primary: '#1C4BDE',
  primaryHover: '#1640C7',
  primaryLight: '#E8EEFB',
  
  // Secondary Colors
  secondary: '#5C6AC4',
  secondaryLight: '#F0F1FA',
  
  // Status Colors
  success: '#28A745',
  successLight: '#E8F5E9',
  warning: '#FFC107',
  warningLight: '#FFF8E1',
  error: '#DC3545',
  errorLight: '#FFEBEE',
  info: '#17A2B8',
  infoLight: '#E1F5FE',
  
  // Neutral Colors
  white: '#FFFFFF',
  grayLight: '#F8F9FA',
  grayMedium: '#6C757D',
  grayDark: '#343A40',
  border: '#E0E0E0',
  borderDark: '#D0D0D0',
  
  // Text Colors
  textPrimary: '#212529',
  textSecondary: '#6C757D',
  textDisabled: '#ADB5BD',
  
  // Text object for backward compatibility
  text: {
    primary: '#212529',
    secondary: '#6C757D',
    tertiary: '#ADB5BD',
    disabled: '#ADB5BD',
  },
  
  // Background Colors
  bgPage: '#F5F7FA',
  bgCard: '#FFFFFF',
  bgHover: '#F8F9FA',
  
  // Sidebar
  sidebarBg: '#FFFFFF',
  sidebarText: '#495057',
  sidebarActive: '#E8EEFB',
  sidebarIconActive: '#1C4BDE',
  
  // Navbar
  navbarBg: '#FFFFFF',
  navbarBorder: '#E0E0E0',
};

// Ant Design Theme Configuration
export const theme = {
  token: {
    colorPrimary: colors.primary,
    colorSuccess: colors.success,
    colorWarning: colors.warning,
    colorError: colors.error,
    colorInfo: colors.info,
    colorBgContainer: colors.white,
    colorBgLayout: colors.bgPage,
    borderRadius: 6,
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Layout: {
      headerBg: colors.navbarBg,
      headerHeight: 60,
      headerPadding: '0 24px',
      siderBg: colors.sidebarBg,
      bodyBg: colors.bgPage,
    },
    Menu: {
      itemBg: colors.sidebarBg,
      itemSelectedBg: colors.sidebarActive,
      itemSelectedColor: colors.primary,
      itemHoverBg: colors.bgHover,
      itemColor: colors.sidebarText,
    },
    Button: {
      primaryColor: colors.white,
      colorPrimary: colors.primary,
      colorPrimaryHover: colors.primaryHover,
      borderRadius: 6,
    },
    Card: {
      borderRadius: 8,
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
    Table: {
      headerBg: colors.grayLight,
      headerColor: colors.textPrimary,
      rowHoverBg: colors.bgHover,
    },
  },
};

// Spacing system (similar to Zoho)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
};

// Z-index layers
export const zIndex = {
  dropdown: 1000,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};
