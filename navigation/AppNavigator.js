import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from 'navigation/MainTabNavigator';

export default createAppContainer(
  createSwitchNavigator({
    Main: MainTabNavigator,
  })
);
