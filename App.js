import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import AppNavigator from 'navigation/AppNavigator';
import colors from 'constants/colors';
import { StoreProvider, useStore } from 'store/store';
import { getTopologyStops } from 'services/star';
import { getStoredStops } from 'services/storage';
import { TASKS } from 'constants/tasks';
import storeLocation from 'store/storeLocation';

TaskManager.defineTask(TASKS.LOCATION_BACKGROUND, ({ data: { locations }, error }) => {
  if (error) {
    return;
  }
  storeLocation.location = locations[locations.length - 1];
});

function Loading({ setLoadingComplete }) {
  const store = useStore();
  return (
    <AppLoading
      startAsync={async () => await loadResourcesAsync(store)}
      onError={handleLoadingError}
      onFinish={() => handleFinishLoading(setLoadingComplete)}
    />
  );
}

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <StoreProvider>
        <Loading setLoadingComplete={setLoadingComplete} />
      </StoreProvider>
    );
  } else {
    return (
      <StoreProvider>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      </StoreProvider>
    );
  }
}

async function loadResourcesAsync(store) {
  await getStoredStops(store.stops.setStored);
  await Permissions.askAsync(Permissions.LOCATION);
  Location.getCurrentPositionAsync({ accuracy: 3 }).then(location => {
    storeLocation.location = location;
  });
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in FavoritesScreencreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      skyfont: require('./assets/fonts/Skyfont-NonCommercial.ttf'),
      ledBoard: require('./assets/fonts/LedBoard.ttf'),
    }),
    Location.startLocationUpdatesAsync(TASKS.LOCATION_BACKGROUND, {
      accuracy: Location.Accuracy.Balanced,
    }),
    getTopologyStops(store.stops.storedIdsFormattedString, store.stops.setEnriched),
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
});
