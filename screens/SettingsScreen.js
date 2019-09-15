import React, { useState, useEffect } from 'react';
import { Picker, View, StyleSheet } from 'react-native';
import StyledScrollView from 'components/styled/StyledScrollView';
import { useStore } from 'store/store';
import {
  getTopologyStops,
  getTopologyLines,
  getTopologyRoutes,
  getTopologyServes,
  getTopologyStop,
} from 'services/star';
import { i18n } from 'services/i18n';
import { PrimaryButton, DangerButton } from 'components/styled/StyledButton';
import theme from 'constants/theme';
import colors from 'constants/colors';
import { MonoText } from 'components/styled/StyledText';

export default function SettingsScreen() {
  const store = useStore();
  const [linesTopo, setLinesTopo] = useState([]);
  const [routesTopo, setRoutesTopo] = useState([]);
  const [servesTopo, setServesTopo] = useState([]);
  const [selectedLine, setSelectedLine] = useState({});
  const [selectedRoute, setSelectedRoute] = useState({});
  const [selectedServe, setSelectedServe] = useState({});

  const selectLine = index => {
    setSelectedLine({ index });
    setSelectedRoute({});
    getTopologyRoutes(linesTopo[index].goingMainRouteId, linesTopo[index].comingMainRouteId).then(
      res => setRoutesTopo(res)
    );
  };

  const selectRoute = index => {
    setSelectedRoute({ index });
    getTopologyStop(routesTopo[index].arrivalStopId).then(({ name, city }) => {
      setSelectedRoute({ index, name, city });
    });
    setSelectedServe({});
    getTopologyServes({ routeId: routesTopo[index].id }).then(res => {
      if (!res.length) {
        getTopologyServes({
          smallLineName: linesTopo[selectedLine.index].smallLineName,
          direction: routesTopo[index].direction,
        }).then(res => {
          setServesTopo(res);
        });
      } else {
        setServesTopo(res);
      }
    });
  };

  const selectServe = index => {
    setSelectedServe({ index });
  };

  const addStoredStops = () => {
    store.stops.addStored({
      stopId: servesTopo[selectedServe.index].stopId,
      stopName: servesTopo[selectedServe.index].stopName,
      smallLineName: servesTopo[selectedServe.index].smallLineName,
      direction: routesTopo[selectedRoute.index].direction,
      destinationName: selectedRoute.name,
      destinationCity: selectedRoute.city,
    });
    getTopologyStops(store.stops.storedIdsFormattedString, store.stops.setEnriched);
  };

  const resetStops = () => {
    store.stops.reset();
  };

  useEffect(() => {
    getTopologyLines().then(res => setLinesTopo(res));
  }, []);

  return (
    <View style={styles.container}>
      <StyledScrollView>
        <Picker selectedValue={selectedLine.index} style={styles.picker} onValueChange={selectLine}>
          {linesTopo.map(({ smallLineName }, index) => (
            <Picker.Item key={index} label={`${smallLineName}`} value={index} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedRoute.index}
          style={styles.picker}
          onValueChange={selectRoute}>
          {routesTopo.map(({ longDescription }, index) => (
            <Picker.Item key={index} label={longDescription} value={index} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedServe.index}
          style={styles.picker}
          onValueChange={selectServe}>
          {servesTopo.map(({ stopName, smallLineName }, index) => (
            <Picker.Item key={index} label={`${smallLineName} - ${stopName}`} value={index} />
          ))}
        </Picker>
        <PrimaryButton title={i18n.t('addStop')} onPress={addStoredStops} />
        <DangerButton
          title={i18n.t('reset')}
          question={i18n.t('question.reset')}
          onPress={resetStops}
        />
      </StyledScrollView>
      <View style={styles.credits}>
        <MonoText>{`${i18n.t('settings.credits')} :`}</MonoText>
        <MonoText style={styles.credit}>
          Bus icon by Alexander Skowalsky from the Noun Project
        </MonoText>
        <MonoText style={styles.credit}>App by guillaumejparis</MonoText>
      </View>
    </View>
  );
}

SettingsScreen.navigationOptions = {
  title: i18n.t('header.settings'),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  picker: {
    height: 50,
    flex: 1,
  },
  credits: {
    backgroundColor: colors.backgroundColor,
    padding: theme.padding.app,
  },
  credit: {
    fontSize: theme.fontSize.smallest,
  },
});
