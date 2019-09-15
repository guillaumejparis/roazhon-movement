import React from 'react';
import { View, StyleSheet } from 'react-native';
import theme from 'constants/theme';
import colors from 'constants/colors';

export default function StyledView({ children, ...props }) {
  return (
    <View {...props} style={[styles.container, props.style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.padding.app,
    backgroundColor: colors.backgroundColor,
  },
});
