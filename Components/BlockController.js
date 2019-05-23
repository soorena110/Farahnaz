import * as React from 'react';
import {Animated, View, StyleSheet} from 'react-native';
import BlockCell from './BlockCell';


const columnsCount = 7;

export default class BlockController extends React.Component {
    state = {
        canMove: false,
        cells: [],
        positionX: 0,
        positionY: 0,
        isVisible: false,
        animationTop: new Animated.Value(0),
        animationLeft: new Animated.Value(0),
        timeout: undefined
    };

    setupNextTurn(cells, startingPositionX) {
        this.setState({
            cells: cells,
            positionX: startingPositionX,
            positionY: 0,
            isVisible: true,
            animationLeft: new Animated.Value(this._computePositionX(startingPositionX)),
            animationTop: new Animated.Value(this._computePositionY(0))
        });
        setTimeout(() => this.setState({canMove: true}), 200);

        this._setNextTimeout();
    }


    dispose() {
        this.setState({
            isVisible: false,
        })
    }

    setCantMove() {
        this.setState({
            canMove: false
        })
    }

    _setNextTimeout() {
        clearTimeout(this.state.timeout);
        this.setState({
            timeout: setTimeout(() => {
                this.goDown(() => {
                    if (this.state.isVisible)
                        this._setNextTimeout();
                });
            }, this.props.gameDelay)
        });
    }

    getCurrentPosition() {
        return {x: this.state.positionX, y: this.state.positionY}
    }

    goDown(onDone) {
        if (!this.state.canMove)
            return;

        const e = this._createMoveEventArg(this.state.positionX, this.state.positionY, 'down');
        if (this.props.movementChecker(e) !== false)
            this._moveToY(this.state.positionY + 1, onDone);
    }

    goRight() {
        if (!this.state.canMove)
            return;

        const nextPostitionX = this.state.positionX + 1;
        if (nextPostitionX >= columnsCount)
            return;

        const e = this._createMoveEventArg(nextPostitionX, this.state.positionY, 'right');
        if (this.props.movementChecker(e) !== false)
            this._moveToX(nextPostitionX);
    }

    goLeft() {
        if (!this.state.canMove)
            return;

        const nextPostitionX = this.state.positionX - 1;
        if (nextPostitionX < 0)
            return;

        const e = this._createMoveEventArg(nextPostitionX, this.state.positionY, 'left');
        if (this.props.movementChecker(e) !== false)
            this._moveToX(nextPostitionX);
    }

    goCirculation() {
        if (!this.state.canMove)
            return;

        const cells = this.state.cells
        this.setState({cells: [cells[2], cells[0], cells[1]]})
    }

    goDownTo(y) {
        if (!this.state.canMove)
            return;

        this.setState({
            timeout: undefined,
            positionY: this.state.positionY
        });
        clearTimeout(this.state.timeout);
        this._moveToY(y, () => {
            const e = this._createMoveEventArg(this.state.positionX, this.state.positionY, 'down');
            this.props.movementChecker(e)
        })
    }

    _moveToX(x) {
        Animated.timing(this.state.animationLeft, {
            toValue: this._computePositionX(x),
            duration: this.props.gameDelay / 20,
        }).start(() => {
            this.setState({positionX: x});
        })
    }

    _moveToY(y, onDone) {
        Animated.timing(this.state.animationTop, {
            toValue: this._computePositionY(y),
            duration: this.props.gameDelay / 10,
        }).start(() => {
            this.setState({positionY: y});
            if (onDone)
                onDone();
        })
    }

    _createMoveEventArg(x, y, movement) {
        return {
            position: {x: x, y: y},
            cells: this.state.cells,
            movement: movement
        }
    }

    _computePositionY(y) {
        return y * this.props.cellSize + this.props.offsetY + 3;
    }

    _computePositionX(x) {
        return x * this.props.cellSize + 7
    }

    render() {
        const otherStyles = {
            top: this.state.animationTop,
            left: this.state.animationLeft,
            opacity: this.state.isVisible ? 1 : 0
        };
        return (
            <Animated.View style={[styles.container, otherStyles]}>
                {
                    this.state.cells.map((cell, ix) => (
                        <BlockCell key={`blockController${ix}`} size={this.props.cellSize} value={cell}/>
                    ))
                }
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: 'rgba(255,255,255,.5)',
        borderColor: 'rgba(0,0,0,.4)',
        borderWidth: 1,
        elevation: 3,
        paddingBottom: 4,
        paddingRight: 5
    }
});

