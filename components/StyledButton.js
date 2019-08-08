import React from 'react';
import { StyleSheet, Button, View } from 'react-native';
import colors from 'constants/colors';
import theme from 'constants/theme';

export function HeaderButton(props) {
  return (
    <View style={styles.container}>
      <Button {...props} color={colors.primary.main} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: theme.padding.app,
  },
});
