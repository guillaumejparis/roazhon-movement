import React from 'react';
import { Text, StyleSheet } from 'react-native';
import theme from 'constants/theme';

export function MonoText(props) {
  return <Text {...props} style={[styles.mono, props.style]} />;
}

export function SkyfontText(props) {
  return <Text {...props} style={[styles.skyfont, props.style]} />;
}

export function LedBoardText(props) {
  return <Text {...props} style={[styles.ledBoard, props.style]} />;
}

export function HeaderText(props) {
  return <Text {...props} style={[styles.header, props.style]} />;
}

export function DividerText(props) {
  return <Text {...props} style={[styles.divider, props.style]} />;
}

export function LineText(props) {
  return <Text {...props} style={[styles.line, props.style]} />;
}

const styles = StyleSheet.create({
  mono: { fontFamily: 'space-mono' },
  skyfont: { fontFamily: 'skyfont' },
  ledBoard: { fontFamily: 'ledBoard' },
  header: { fontStyle: 'italic' },
  divider: { fontWeight: '500', fontSize: theme.fontSize.main },
  line: { fontWeight: 'bold', fontSize: theme.fontSize.big },
});
