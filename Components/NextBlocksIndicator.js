import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import BlockCell from './BlockCell';

export default class NextBlocksIndicator extends React.Component {
  state = { blocks: [0, 0, 0] };
  generateNextBlocks() {
    const nextBlocks = this.state.blocks.map(() => {
      if (this.props.specialsCount && Math.random() * 100 <= 30)
        return 100 + Math.floor(Math.random() * this.props.specialsCount + 1)

      return Math.floor(Math.random() * this.props.colorsCount + 1)
    });
    this.setState({ blocks: nextBlocks });
  }

  getNextBlocks() {
    return [...this.state.blocks];
  }

  render() {
    const otherStyles = {
      top: this.props.position.top,
      right: this.props.position.right
    };

    return (
      <View style={[styles.nextBlocksView, otherStyles]}>
        {this.state.blocks.map((nextBlockValue, ix) => (
          <BlockCell key={`nextBlock${ix}`}
            value={nextBlockValue}
            size={this.props.cellSize} />
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  nextBlocksView: {
    borderColor: 'rgba(255,255,255,.4)',
    backgroundColor: 'rgba(255,255,255,.5)',
    borderWidth: 2,
    elevation: 2,
    position: 'absolute',
    paddingRight: 4,
    paddingBottom: 4
  }
});

