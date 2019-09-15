import { AsyncStorage } from 'react-native';
import { STORAGE_CONSTANTS } from 'constants/storage';

export const storeStoredStops = async storedStops => {
  await AsyncStorage.setItem(STORAGE_CONSTANTS.STORED_STOPS, JSON.stringify(storedStops));
};

export const getStoredStops = async setStoredStopsInStore => {
  const storedStopsString = await AsyncStorage.getItem(STORAGE_CONSTANTS.STORED_STOPS);
  const storedStops = JSON.parse(storedStopsString);
  if (storedStops) {
    await setStoredStopsInStore(storedStops);
  }
};
