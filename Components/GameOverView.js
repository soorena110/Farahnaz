import * as React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');


export default class GameOverView extends React.Component {
  render() {
    return (
      <View style={[styles.GameOverView, { height: this.props.isVisible ? undefined : 0 }]}>
        <Text style={styles.gameOverText}>Game Over !!! ;)</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  GameOverView: {
    position: 'absolute',
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 8,
    backgroundColor: 'rgba(255,255,255,.8)',
    overflow:'hidden'
  },
  gameOverText: {
    fontSize: 50,
    color: 'darkcyan',
    textShadowColor: 'darkcyan',
    textShadowRadius: 10,
    textShadowOffset: { width: 1, height: 1 }
  }
});

