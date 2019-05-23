import * as React from 'react';
import { Text, StyleSheet } from 'react-native';

export default class GridThresholdLine extends React.Component {
  render() {
    return (
      <Text style={[styles.thresholdLine, { height: this.props.height }]} />
    );
  }
}

const styles = StyleSheet.create({
  thresholdLine: {
    position: 'absolute',
    color: 'white',
    opacity: .8,
    width: '102%',
    backgroundColor: 'rgba(255,255,255,.3)',
    textAlign: 'center',
    borderBottomColor: 'rgba(255,255,255,.5)',
    borderBottomWidth: 2
  }
});

