import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import BlockCell from './BlockCell';

// const nextLevels = [-1, -1, -1, -1, -1, 0, 100, 300, 600, 1000, 1500, 2100, 9999999999999];
const nextLevels = [-1, -1, -1, -1, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70];
const colors = [0, 1, 2, 3, 4, 101, 5, 201, 6, 301, 7, 401, 8, 501, 9, 601, 0];

export default class LevelIndicator extends React.Component {
  getLevel() {
    const currentLevel = this._findCurrentLevel();
    return colors.filter((ib, ix) => ix <= currentLevel && ib < 100).length - 1;
  }
  getSpecialLevel() {
    const currentLevel = this._findCurrentLevel();
    return colors.filter((ib, ix) => ix <= currentLevel && 100 < ib &&  ib < 200).length;
  }

  getBonusLevel() {
    const currentLevel = this._findCurrentLevel();
    return colors.filter((ib, ix) => ix <= currentLevel && ib > 200).length;
  }

  _findCurrentLevel() {
    const score = this.props.gameScore;

    let currentLevel = 0;
    for (let i = 0; i < nextLevels.length - 1; i++)
      if (nextLevels[i] <= score && nextLevels[i + 1] > score)
        currentLevel = i;

    return currentLevel;
  }

  _computeCompletedPercent() {
    const score = this.props.gameScore;
    const currentLevel = this._findCurrentLevel();
    const prevStage = nextLevels[currentLevel];
    const nextStage = nextLevels[currentLevel + 1];

    return Math.floor((score - prevStage) / (nextStage - prevStage) * 100);
  }

  render() {
    const otherStyles = {
      bottom: this.props.position.bottom,
      right: this.props.position.right
    };

    const currentLevel = this.props.colorsCount + 1;
    const percent = this._computeCompletedPercent();

    if (currentLevel >= nextLevels.length - 2)
      return null;

    return (
      <View style={[styles.container, otherStyles]}>
        <Text style={styles.nextText}>Next</Text>
        <View style={[styles.halfBlock, { width: `${percent * 1 + 10}%` }]}>
          <BlockCell value={colors[currentLevel]}
            size={this.props.cellSize} />
        </View>
        <Text style={styles.nextText}>{percent}%</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    borderColor: 'rgba(255,255,255,.4)',
    backgroundColor: 'rgba(255,255,255,.5)',
    borderWidth: 2,
    elevation: 2,
    position: 'absolute',
    paddingRight: 4,
    paddingBottom: 4
  },
  nextText: {
    color: 'white',
    alignSelf: 'center',
    textShadowColor: 'black',
    textShadowRadius: 5,
  },
  halfBlock: {
    overflow: 'hidden',
    marginBottom: 3
  }
});

