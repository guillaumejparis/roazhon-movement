import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RNChipView } from 'react-native-chip-view';

import theme from 'constants/theme';
import colors from 'constants/colors';
import { nameIconByPlateform } from 'services/utils';

export default ({ icon, text, style }) => (
  <View style={style}>
    <RNChipView
      title={text}
      style={style}
      height={theme.chip.height}
      titleStyle={styles.title}
      backgroundColor={colors.chipColor}
      avatar={
        icon && (
          <Ionicons
            color={colors.white}
            name={nameIconByPlateform(icon)}
            size={theme.chip.iconSize}
          />
        )
      }
      avatarStyle={styles.icon}
      selectable={false}
    />
  </View>
);

const styles = StyleSheet.create({
  title: {
    fontSize: theme.defaultFontSize,
    fontWeight: 'normal',
    minWidth: theme.chip.minTitleWidth,
    textAlign: 'center',
  },
  icon: {
    color: colors.white,
    backgroundColor: colors.accent.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {},
});
