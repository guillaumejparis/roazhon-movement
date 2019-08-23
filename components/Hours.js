import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from 'constants/theme';
import HoursChips from 'components/HoursChips';
import { getHours } from 'services/star';

// https://data.explore.star.fr/explore/dataset/tco-bus-circulation-passages-tr/information/
export default function Hours({ refresh, bus, stop, destination }) {
  const [pristine, setPristine] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [hours, setHours] = useState([]);

  const updateHours = async () => {
    setUpdating(true);
    setHours([]);
    await getHours(bus, stop, destination).then(hours => {
      setHours(hours);
      setUpdating(false);
      if (pristine) {
        setPristine(false);
      }
    });
  };

  useEffect(() => {
    updateHours();
  }, [null]);
  useEffect(() => {
    refresh && updateHours();
  }, [refresh]);

  return (
    <View>
      <Text style={styles.stopText}>{`${bus} - ${stop} (${destination})`}</Text>
      {pristine ? (
        <HoursChips sample />
      ) : hours.length ? (
        <HoursChips hours={hours} />
      ) : updating ? null : (
        <Text>Pas de bus</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stopText: {
    paddingBottom: theme.padding.betweenElements,
  },
});
