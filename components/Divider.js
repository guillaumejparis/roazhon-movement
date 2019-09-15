import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DividerText } from './styled/StyledText';

export default function Divider({ borderColor, dashed, orientation, color, children }) {
  return (
    <View style={styles.container}>
      <DividerText style={[styles.text, { color }]}>{children}</DividerText>
      <View
        style={[
          styles.line,
          { borderColor },
          dashed && styles.dashed,
          orientation === 'left' ? styles.shortWidth : { flex: 1 },
        ]}
      />
      <View
        style={[
          styles.line,
          { borderColor },
          dashed && styles.dashed,
          orientation === 'right' ? styles.shortWidth : { flex: 1 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 24,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 12,
  },
  line: {
    height: 24,
    borderBottomWidth: 0.7,
    transform: [{ translateY: -12 }],
  },
  shortWidth: {
    width: 20,
  },
  dashed: {
    borderStyle: 'dashed',
  },
  text: {
    paddingRight: 24,
  },
});
