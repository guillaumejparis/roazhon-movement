import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import theme from 'constants/theme';
import { sampleHours } from 'services/samples';
import HourChip from 'components/hours/HourChip';

const Chips = ({ hours, sample }) => {
  let first = true;

  return hours.map(({ minutesDiff, secondsDiff, courseId, precision }) => {
    if (first) {
      first = false;
    }
    return (
      <HourChip
        key={courseId}
        style={styles.chip}
        first={first}
        minutes={minutesDiff}
        seconds={secondsDiff}
        imminent={minutesDiff === '0' && secondsDiff === '00'}
        icon={precision === 'Temps réel' && 'flash'}
        sample={sample}
      />
    );
  });
};

export default function HoursChips({ hours, sample }) {
  const [pulseAnim] = useState(new Animated.Value(0.2));

  const pulse = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 0.8, duration: 800 }),
      Animated.timing(pulseAnim, { toValue: 0.2, duration: 800 }),
    ]).start(() => sample && pulse());
  };

  useEffect(() => {
    pulse();
  }, [null]);

  if (sample) {
    return (
      <Animated.View style={[styles.container, { opacity: pulseAnim }]}>
        <Chips hours={sampleHours} sample />
      </Animated.View>
    );
  }
  return (
    <View style={styles.container}>
      <Chips hours={hours} />
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingRight: theme.padding.betweenBadges,
    paddingBottom: theme.padding.betweenElements,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingLeft: theme.padding.tab,
  },
});
