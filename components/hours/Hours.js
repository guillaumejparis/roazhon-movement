import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from 'constants/theme';
import HoursChips from 'components/hours/HoursChips';
import LineIcon from 'components/LineIcon';
import { LedBoardText } from 'components/styled/StyledText';

export default function Hours({ hours, smallLineName, destinationName, destinationCity }) {
  return (
    <View>
      <View style={styles.lineContainer}>
        <LineIcon name={smallLineName} backgroundColor="#cecece" textColor="#ffffff" />
        <LedBoardText style={styles.destination}>{`->`}</LedBoardText>
        <Text style={styles.destination}>{`${destinationName} (${destinationCity})`}</Text>
      </View>
      {!hours ? (
        <HoursChips sample />
      ) : hours && hours.length ? (
        <HoursChips hours={hours} />
      ) : (
        <Text style={styles.noBusText}>Pas de bus</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  lineContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: theme.padding.betweenElements,
  },
  destination: {
    fontSize: theme.fontSize.main,
    paddingLeft: theme.padding.onSameLine,
  },
  noBusText: {
    paddingBottom: theme.padding.betweenElements,
  },
});
