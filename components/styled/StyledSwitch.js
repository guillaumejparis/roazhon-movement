import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import colors from 'constants/colors';
import theme from 'constants/theme';

export function HeaderSwitch(props) {
  return (
    <View style={styles.container}>
      <Switch
        {...props}
        thumbColor={props.value ? colors.primary.main : colors.noSelected.main}
        trackColor={{ true: colors.primary.light, false: colors.noSelected.light }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: theme.padding.app,
  },
});
