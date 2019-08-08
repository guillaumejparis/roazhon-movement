import { Platform } from 'react-native';

const nameIconByPlateform = (icon, outline = false, focused) =>
  Platform.OS === 'ios' ? `ios-${icon}${outline ? (focused ? '' : '-outline') : ''}` : `md-${icon}`;

export { nameIconByPlateform };
