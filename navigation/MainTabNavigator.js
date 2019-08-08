import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import TabBarIcon from 'components/TabBarIcon';
import FavoritesScreen from 'screens/FavoritesScreen';
import MapScreen from 'screens/MapScreen';
import SettingsScreen from 'screens/SettingsScreen';
import { nameIconByPlateform } from 'services/utils';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const FavoritesStack = createStackNavigator(
  {
    Favorites: FavoritesScreen,
  },
  config
);

FavoritesStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={nameIconByPlateform('star', true, focused)} />
  ),
};

FavoritesStack.path = '';

const MapStack = createStackNavigator(
  {
    Map: MapScreen,
  },
  config
);

MapStack.navigationOptions = {
  tabBarLabel: 'Map',
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={nameIconByPlateform('map')} />,
};

MapStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={nameIconByPlateform('options')} />
  ),
};

SettingsStack.path = '';

const tabNavigator = createBottomTabNavigator(
  {
    FavoritesStack,
    MapStack,
    SettingsStack,
  },
  {
    tabBarOptions: {
      showLabel: false,
    },
  }
);

tabNavigator.path = '';

export default tabNavigator;
