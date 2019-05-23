import * as React from 'react';
import { Text, StyleSheet, Image } from 'react-native';


export default class ScoreIndicator extends React.Component {
  render() {
    const position = { top: this.props.position.top, right: this.props.position.right, left: this.props.position.left };
    return (
      <Text style={[styles.scoreText, position]}>{this.props.title} : {this.props.value}</Text>
    );
  }
}

ScoreIndicator.defaultProps = {
  title : 'Score'
}

const styles = StyleSheet.create({
  scoreText: {
    position: 'absolute',
    color: 'white',
    backgroundColor: 'rgba(255,255,255,.3)',
    padding: 3,
    paddingRight: 10,
    paddingLeft: 10,
    borderColor: 'rgba(255,255,255,.5)',
    borderWidth: 1,
    width: '45%',
    textShadowColor:'black',
    textShadowRadius:5,
  }
});

