import { Platform } from 'react-native';

const nameIconByPlateform = (icon, outline = false, focused) =>
  Platform.OS === 'ios' ? `ios-${icon}${outline ? (focused ? '' : '-outline') : ''}` : `md-${icon}`;

const checkNested = (obj, level, ...rest) => {
  if (obj === undefined) return false;
  if (rest.length === 0 && obj.hasOwnProperty(level)) return true;
  return checkNested(obj[level], ...rest);
};

export { nameIconByPlateform, checkNested };
