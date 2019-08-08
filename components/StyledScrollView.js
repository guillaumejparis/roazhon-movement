import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import theme from 'constants/theme';
import colors from 'constants/colors';

export default ({ children }) => <ScrollView style={styles.container}>{children}</ScrollView>;

const styles = StyleSheet.create({
  container: {
    padding: theme.padding.app,
    backgroundColor: colors.backgroundColor,
  },
});
