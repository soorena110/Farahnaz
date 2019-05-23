import * as React from 'react';
import { View, StyleSheet, AppState } from 'react-native';
import Sound from 'react-native-sound';

import BlockCell from './BlockCell';
import GridThresholdLine from './GridThresholdLine';
import { ColorMatcher } from './ColorMatcher';

const thresholdBlockCount = 3;

Sound.setCategory('Playback');
const breakingBlockSound = [
    undefined,
    new Sound(require('../Sound/Breaking/Red.mp3')),
    new Sound(require('../Sound/Breaking/Green.mp3')),
    new Sound(require('../Sound/Breaking/Blue.mp3')),
    new Sound(require('../Sound/Breaking/Yellow.mp3')),
    new Sound(require('../Sound/Breaking/Cyan.mp3')),
    new Sound(require('../Sound/Breaking/Purple.mp3')),
    new Sound(require('../Sound/Breaking/Orange.mp3')),
    new Sound(require('../Sound/Breaking/White.mp3')),
    new Sound(require('../Sound/Breaking/Black.mp3')),
];

const propablity = [.02, .04, .05, .06, .065, 0.07];

export default class BlockGrid extends React.Component {
    constructor(props) {
        super(props);

        const cells = [1, 2, 3, 4, 5, 6, 7].map(() => (
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ));

        this.state = {
            cells: cells
        };
    }




    _b(map, color = 'color:white') {
        let s = '';
        for (let j = 0; j < this.state.cells[0].length; j++) {
            for (let i = 0; i < this.state.cells.length; i++)
                s += this.state.cells[i][j];
            s += '   ';
            for (let i = 0; i < map.length; i++)
                s += map[i][j] ? 'B' : '_';

            s += '\n';
        }
        console.log('%c' + s, color);
    }


    injectCells(x, y, cells) {
        const newCells = this.state.cells;
        for (const i of [0, 1, 2])
            this.state.cells[x][y + i] = cells[i];
        this.setState({ cells: newCells })
    }

    isBlockEmpty(x, y) {
        if (x >= this.state.cells.length || y >= this.state.cells[x].length)
            return false;

        return this.state.cells[x][y] === 0;
    }

    getBestStartingPositionX() {
        const sideColumnsCount = Math.floor(this.state.cells.length / 2);

        for (let i = 0; i <= sideColumnsCount; i++) {
            if (this.state.cells[sideColumnsCount + i][thresholdBlockCount] === 0)
                return sideColumnsCount + i;
            if (this.state.cells[sideColumnsCount - i][thresholdBlockCount] === 0)
                return sideColumnsCount - i;
        }

        for (let i = 0; i <= sideColumnsCount; i++) {
            if (this.state.cells[sideColumnsCount + i][thresholdBlockCount - 1] === 0)
                return sideColumnsCount + i;
            if (this.state.cells[sideColumnsCount - i][thresholdBlockCount - 1] === 0)
                return sideColumnsCount - i;
        }

        return null;
    }

    getFirstEmptyPositionYInColumn(positionX) {
        const emptyPositionY = this.state.cells[positionX].findIndex(cell => cell !== 0);
        if (emptyPositionY !== -1)
            return emptyPositionY;
        return this.state.cells[positionX].length;
    }

    breakMatchedBlocks(onDone, onScoreAdded) {
        const breakingMatrix = ColorMatcher._findBreakingMatrix(this.state.cells);

        if (!BlockGrid._hasBlockToBreak(breakingMatrix))
            return onDone();

        this._breakBreakingBlocks(breakingMatrix);

        const brokenBlocksCound = this._sumOfBrokenBlocks(breakingMatrix);

        BlockGrid._playBreakingColorSound(this.state.cells, breakingMatrix);

        onScoreAdded(brokenBlocksCound);

        setTimeout(() => {
            this._trimColumns(breakingMatrix, () => {
                this._resetBrokenBlocks(breakingMatrix);
                setTimeout(() => {
                    this.breakMatchedBlocks(onDone, onScoreAdded);
                }, 10);
            });
        }, 1000);
    }

    dropRandomEvents() {
        const cells = this.state.cells;
        for (let i = 0; i < cells.length; i++)
            for (let j = 0; j < cells[i].length; j++) {
                if (!cells[i][j] || cells[i][j] > 200)
                    continue;
                const random = Math.random() * 100;

                for (let k = 0; k < propablity.length; k++)
                    if (random <= propablity[k]) {
                        cells[i][j] += (k + 2) * 100;
                        break;
                    }
            }
        this._setCells(cells);
    }

    static _playBreakingColorSound(cells, breakingMatrix) {
        const breakingColors = [];
        for (let i = 0; i < cells.length; i++)
            for (let j = 0; j < cells[i].length; j++) {
                if (breakingMatrix[i][j])
                    breakingColors[cells[i][j] % 100] = true;
            }

        for (let i = 1; i < breakingColors.length; i++)
            if (breakingColors[i]) {
                const sound = breakingBlockSound[i];
                if (sound) {
                    sound.stop();
                    sound.play();
                }
            }
    }

    _sumOfBrokenBlocks(breakingMatrix) {
        let sum = 0;
        breakingMatrix.forEach(v => {
            if (typeof v === 'object')
                sum += this._sumOfBrokenBlocks(v);
            else
                sum += v ? 1 : 0
        });
        return sum;
    }

    _trimColumns(breakingMatrix, onDone) {
        const cells = this.state.cells;

        for (let i = 0; i < cells.length; i++) {
            let fallingSteps = 0;
            for (let j = cells[0].length - 1; j >= 0; j--) {
                if (cells[i][j] === 0)
                    break;
                if (breakingMatrix[i][j]) {
                    fallingSteps++;
                    cells[i][j] = 0;
                }
                else if (fallingSteps !== 0) {
                    cells[i][j + fallingSteps] = cells[i][j];
                    cells[i][j] = 0;
                }
            }
        }
        this._setCells(cells);
        onDone();
    }

    _setCells(cells) {
        this.setState(cells);
    }

    static _hasBlockToBreak(breakingMatrix) {
        for (let i = 0; i < breakingMatrix.length; i++)
            for (let j = breakingMatrix[i].length - 1; j >= 0; j--)
                if (breakingMatrix[i][j])
                    return true;
        return false;
    }

    _breakBreakingBlocks(breakingMatrix) {
        for (let i = 0; i < breakingMatrix.length; i++)
            for (let j = breakingMatrix[i].length - 1; j >= 0; j--)
                if (breakingMatrix[i][j]) {
                    this.refs[`cell_${i}_${j}`].break();
                }
    }

    _resetBrokenBlocks(breakingMatrix) {
        for (let i = 0; i < breakingMatrix.length; i++)
            for (let j = breakingMatrix[i].length - 1; j >= 0; j--)
                if (breakingMatrix[i][j])
                    this.refs[`cell_${i}_${j}`].reset();
    }

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                {this.state.cells.map((column, ix) => (
                    <View key={`gridCol${ix}`} style={styles.columns}>
                        {column.map((cell, jx) => (
                            <BlockCell ref={`cell_${ix}_${jx}`} key={`gridCell_${ix}_${jx}`} size={this.props.cellSize}
                                value={cell} />
                        ))}
                    </View>
                ))}
                <GridThresholdLine height={this.props.cellSize * thresholdBlockCount + 3} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,.5)',
        padding: 1,
        paddingRight: 6,
        borderColor: 'rgba(255,255,255,.4)',
        borderWidth: 2,
        elevation: 3
    },
    columns: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    }
});

