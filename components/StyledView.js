import React from 'react';
import { StyleSheet, View } from 'react-native';
import theme from 'constants/theme';

export default ({ children }) => <View style={styles.container}>{children}</View>;

const styles = StyleSheet.create({
  container: {
    padding: theme.padding.app,
  },
});
