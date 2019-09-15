import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import theme from 'constants/theme';
import colors from 'constants/colors';

export default function StyledScrollView({ children, ...props }) {
  return (
    <ScrollView {...props} style={[styles.container, props.style]}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.padding.app,
    backgroundColor: colors.backgroundColor,
  },
});
