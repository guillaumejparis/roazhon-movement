import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { i18n } from 'services/i18n';

export default function AddStop({ addStored }) {
  return (
    <View style={styles.container}>
      <Button
        title={i18n.t('addStop')}
        onPress={() =>
          addStored({
            stopName: 'Chèques Postaux',
            stopId: 1239,
            smallLineName: 'C4',
            destination: 'ZA Saint-Sulpice',
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
