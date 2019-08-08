import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import { differenceInMinutes, parseISO } from 'date-fns';
import conf from 'conf/conf';
import { fetchWithAuth } from 'services/api';
import { starApiConstants } from 'constants/api';
import Chip from 'components/Chip';
import theme from 'constants/theme';
import StyledScrollView from 'components/StyledScrollView';

const sampleHours = [
  { idcourse: 'id0', minutesDiff: '', precision: 'Temps réel' },
  { idcourse: 'id1', minutesDiff: '', precision: 'Temps réel' },
  { idcourse: 'id2', minutesDiff: '', precision: 'Temps réel' },
  { idcourse: 'id3', minutesDiff: '', precision: '' },
  { idcourse: 'id4', minutesDiff: '', precision: '' },
  { idcourse: 'id5', minutesDiff: '', precision: '' },
  { idcourse: 'id6', minutesDiff: '', precision: '' },
];

const getHours = async () => {
  const response = await fetchWithAuth(conf.starApi.hoursToStopRecords, {
    where: `
      ${starApiConstants.smallLineName}="C6" 
      AND ${starApiConstants.stopName}="Hublais" 
      AND ${starApiConstants.destination}="Aéroport"
    `,
    select: `
      ${starApiConstants.theoreticalArrival},
      ${starApiConstants.precision},
      ${starApiConstants.arrival},
       ${starApiConstants.id}
    `,
    sort: `${starApiConstants.arrival}`,
    rows: 10,
    pretty: false,
    timezone: 'UTC',
  });
  if (response.records) {
    return response.records.map(record => ({
      ...record.record.fields,
      minutesDiff: `${differenceInMinutes(
        parseISO(record.record.fields[starApiConstants.arrival]),
        Date.now()
      )}`,
    }));
  }
  return [];
};

export default function FavoritesScreen() {
  const [pristine, setPristine] = useState(true);
  const [pulseAnim] = useState(new Animated.Value(0.2));
  const [hours, setHours] = useState([]);
  const pulse = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 0.8, duration: 800 }),
      Animated.timing(pulseAnim, { toValue: 0.2, duration: 800 }),
    ]).start(() => pristine && pulse());
  };
  useEffect(() => {
    pulse();
    getHours().then(hours => {
      setHours(hours);
      setPristine(false);
    });
  }, [null]);

  const StyledChips = ({ hours, sample = false }) =>
    hours.map(hour => (
      <Chip
        key={hour[starApiConstants.id]}
        style={styles.chip}
        text={hour.minutesDiff}
        icon={hour[starApiConstants.precision] === 'Temps réel' && 'flash'}
        sample={sample}
      />
    ));

  return (
    <StyledScrollView>
      <Text style={styles.stopText}>Hublais (Aéroport)</Text>
      <View style={styles.chipsContainer}>
        {pristine ? (
          <Animated.View
            style={{
              ...styles.chipsContainer,
              opacity: pulseAnim,
            }}>
            <StyledChips hours={sampleHours} sample />
          </Animated.View>
        ) : hours.length ? (
          <StyledChips hours={hours} />
        ) : (
          <Text>Rien</Text>
        )}
      </View>
    </StyledScrollView>
  );
}

FavoritesScreen.navigationOptions = {
  title: 'Favorites',
};

const styles = StyleSheet.create({
  stopText: {
    paddingBottom: theme.padding.betweenElements,
  },
  chipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  chip: {
    paddingRight: theme.padding.betweenBadges,
    paddingBottom: theme.padding.betweenElements,
  },
});
