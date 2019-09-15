import React, { useEffect, useState } from 'react';
import { useObserver } from 'mobx-react-lite';
import { useStore } from 'store/store';
import * as Location from 'expo-location';
import RefreshControlScrollView from 'components/RefreshControlScrollView';
import Hours from 'components/hours/Hours';
import useAppState from 'hooks/useAppState';
// import { HeaderSwitch } from 'components/styled/StyledSwitch';
// import { HeaderText } from 'components/styled/StyledText';
import Divider from 'components/Divider';
import colors from 'constants/colors';
import storeLocation from 'store/storeLocation';
import { i18n } from 'services/i18n';

export default function FavoritesScreen({ navigation }) {
  const store = useStore();
  const [switchNearestValue, setSwitchNearesValue] = useState(true);

  const refresh = async () => {
    if (switchNearestValue) {
      store.stops.updateNearest();
    }
    await store.stops.updateHours(switchNearestValue);
  };

  const handleSwitchChange = async value => {
    await setSwitchNearesValue(value);
  };

  useAppState({
    onForeground: refresh,
  });

  useEffect(() => {
    const willFocusListener = navigation.addListener('willFocus', refresh);
    navigation.setParams({
      switchNearestValue,
      switchNearestWaiting: false,
      handleSwitchChange,
    });
    Location.getCurrentPositionAsync({ accuracy: 3 }).then(location => {
      storeLocation.location = location;
      refresh();
    });
    return () => willFocusListener.remove();
  }, []);
  useEffect(() => {
    refresh().then(() => {
      navigation.setParams({ switchNearestWaiting: false });
    });
  }, [switchNearestValue]);

  return useObserver(() => (
    <RefreshControlScrollView refresh={refresh}>
      {(switchNearestValue
        ? store.stops.nearestEnriched
        : Object.values(store.stops.enriched)
      ).reduce((all, { stopList, stopName }) => {
        all.push(
          <Divider borderColor={colors.noSelected.main} key={stopName}>
            {stopName}
          </Divider>
        );
        stopList.map(({ buses }) => {
          return buses.map(bus => {
            all.push(<Hours key={`${bus.direction}${bus.smallLineName}${stopName}`} {...bus} />);
          });
        });
        return all;
      }, [])}
    </RefreshControlScrollView>
  ));
}

FavoritesScreen.navigationOptions = ({ navigation }) => ({
  title: i18n.t('header.favorites'),
  // headerRight: (
  //   <>
  //     <HeaderText>GPS</HeaderText>
  //     <HeaderSwitch
  //       onValueChange={value => {
  //         navigation.setParams({ switchNearestWaiting: true });
  //         navigation.setParams({ switchNearestValue: value });
  //         navigation.getParam('handleSwitchChange')(value);
  //       }}
  //       disabled={navigation.getParam('switchNearestWaiting')}
  //       value={navigation.getParam('switchNearestValue')}
  //     />
  //   </>
  // ),
});
