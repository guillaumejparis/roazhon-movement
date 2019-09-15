import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LineText } from 'components/styled/StyledText';
import theme from 'constants/theme';

export default function LineIcon({ name, backgroundColor, textColor }) {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <LineText style={{ color: textColor }}>{name}</LineText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: theme.padding.smallest,
    height: 21,
    borderRadius: 4,
  },
});
