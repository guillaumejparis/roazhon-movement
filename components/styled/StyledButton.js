import React from 'react';
import { StyleSheet, Button, View, Alert } from 'react-native';
import colors from 'constants/colors';
import theme from 'constants/theme';
import { i18n } from 'services/i18n';

export function PrimaryButton(props) {
  return (
    <View style={[styles.container, props.viewStyle]}>
      <Button color={colors.primary.main} {...props} />
    </View>
  );
}

export function AccentButton(props) {
  return (
    <View style={[styles.container, props.viewStyle]}>
      <Button color={colors.accent.main} {...props} />
    </View>
  );
}

export function DangerButton(props) {
  const onPress = () => {
    Alert.alert(
      props.question,
      '',
      [
        {
          text: i18n.t('cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        { text: i18n.t('ok'), onPress: props.onPress },
      ],
      { cancelable: false }
    );
  };
  return (
    <View style={[styles.container, props.viewStyle]}>
      <Button color={colors.danger} {...props} onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.padding.app,
  },
});
