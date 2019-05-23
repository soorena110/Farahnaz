import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import GameView from './Components/GameView';
import GameOverView from './Components/GameOverView';
import BackgroundProcesses from './Components/BackgroundProcesses';

const blocksCount = { vertical: 14, horizonal: 7 };

export default class MainActivity extends React.Component {
  state = { gameState: 'running' }

  render() {
    return (
      <View style={{ flex: 1, background:'red' }}>
        <GameView blocksCount={blocksCount} />
        <GameOverView isVisible={this.state.gameState === 'end'} />
        <BackgroundProcesses />
      </View>
    );
  }
}

const styles = StyleSheet.create({

});
