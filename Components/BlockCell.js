import * as React from 'react';
import { Animated, Image } from 'react-native';

const colors = [
  undefined,
  require('../Images/Blocks/Red.png'),
  require('../Images/Blocks/Green.png'),
  require('../Images/Blocks/Blue.png'),
  require('../Images/Blocks/Yellow.png'),
  require('../Images/Blocks/Cyan.png'),
  require('../Images/Blocks/Purple.png'),
  require('../Images/Blocks/Orange.png'),
  require('../Images/Blocks/White.png'),
  require('../Images/Blocks/Black.png'),
];

const specialColors = [
  undefined,
  require('../Images/Bonus/Rainbow.png')
]

const bonuses = [
  undefined,
  require('../Images/Bonus/TimeStop.png'),
  require('../Images/Bonus/SameColors.png'),
  require('../Images/Bonus/RemoveColor.png'),
  require('../Images/Bonus/ChangeColors.png'),
  require('../Images/Bonus/LineBreak.png'),
  require('../Images/Bonus/Bomb.png'),
]

export default class BlockCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animationHeight: new Animated.Value(props.size),
      animationOpacity: new Animated.Value(1),
      animationOverlayOpacity: new Animated.Value(0)
    }
  }

  componentWillReceiveProps() {
    if (this.props.value > 200 && !this._settingOverlayOpacityAnimator) {
      this._setOverlayOpacity(.7);
      this._settingOverlayOpacityAnimator = true
    }
  }

  _setOverlayOpacity(toValue) {
    Animated.timing(this.state.animationOverlayOpacity, {
      toValue: toValue,
      duration: 1000
    }).start(() => this._setOverlayOpacity(.7 - toValue))
  }


  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.value !== this.props.value)
      return true;

    return nextState.opacity !== this.state.opacity;
  }

  _setOpacity(toValue, onDone, times = 5) {
    if (times <= 0) {
      if (onDone)
        onDone();
      return;
    }
    Animated.timing(this.state.animationOpacity, {
      toValue: toValue,
      duration: 150
    }).start(() => this._setOpacity(1.5 - toValue, onDone, times - 1));
  }

  break() {
    this._setOpacity(.5, () => {
      this._setOpacity(0, null, 1);
      Animated.timing(this.state.animationHeight, {
        toValue: 0,
        duration: 200
      }).start()
    });
  }

  reset() {
    Animated.timing(this.state.animationOpacity, {
      toValue: 1,
      duration: 0
    }).start();
    Animated.timing(this.state.animationHeight, {
      toValue: this.props.size,
      duration: 0
    }).start();
  }

  getImageColor() {
    if (this.props.value > 100 && this.props.value < 200)
      return specialColors[this.props.value % 100];

    return colors[this.props.value % 100]
  }

  render() {
    const blockRectStyle = {
      width: this.props.size,
      height: this.state.animationHeight,
      opacity: this.state.animationOpacity
    };
    const blockCellImage = {
      width: this.props.size * 1.1,
      height: this.props.size * 1.1
    }

    const overlayRectStyle = {
      width: this.props.size,
      height: 0,
      zIndex: 99,
      position: "relative",
      bottom: this.props.size * .99,
      opacity: this.state.animationOverlayOpacity
    };

    return (
      <React.Fragment>
        <Animated.View style={blockRectStyle}>
          <Image ref="theImage" style={blockCellImage}
            source={this.getImageColor()} />
        </Animated.View>
        {this.props.value > 200 &&
          <Animated.View style={overlayRectStyle}>
            <Image ref="theOverlay" style={[blockCellImage]}
              source={bonuses[1]} />
          </Animated.View>}
      </React.Fragment>
    );
  }
}