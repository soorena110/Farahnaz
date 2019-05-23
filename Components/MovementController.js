import * as React from 'react';
import { TouchableNativeFeedback, Text, View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');


export default class MovementController extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <TouchableNativeFeedback style={{ flex: 1 }} onPress={() => this.props.onLeftMove()}>
          <Text style={styles.controllerButtonInside} />
        </TouchableNativeFeedback>
        <View style={styles.controllerButton}>
          <TouchableNativeFeedback style={{ flex: 3 }} onPress={() => this.props.onUpMove()}>
            <Text style={styles.controllerButton} />
          </TouchableNativeFeedback>
          <View style={styles.controllerButton} />
          <TouchableNativeFeedback style={{ flex: 1 }} onPress={() => this.props.onDownMove()}>
            <Text style={styles.controllerButtonInside} />
          </TouchableNativeFeedback>
        </View>
        <TouchableNativeFeedback style={{ flex: 1 }} onPress={() => this.props.onRightMove()}>
          <Text style={styles.controllerButtonInside} />
        </TouchableNativeFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    top: 0,
    left: 0,
    zIndex: 999,
    justifyContent: 'space-between',
  },
  controllerButton: {
    flex: 3,
    flexDirection: 'column'
  },
  controllerButtonInside: {
    flex: 1,
  }
});

