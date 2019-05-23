import * as React from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text } from 'react-native';

import BlockGrid from './BlockGrid';
import ScoreIndicator from './ScoreIndicator';
import NextBlocksIndicator from './NextBlocksIndicator';
import LevelIndicator from './LevelIndicator';
import BlockController from './BlockController';
import MovementController from './MovementController';

const { height } = Dimensions.get('window');
const backgroundImage = require('../Images/Background.jpg');
const baseColorsCount = 4;
const baseBonusCount = 0;
const baseSpecialsCount = 0;

export default class MainActivity extends React.Component {
    state = {
        gameDelay: 1000,
        colorsCount: baseColorsCount,
        bonusCount: baseBonusCount,
        specialsCount: baseSpecialsCount,
        turn: 0,
        score: 0,
        maxScore: 0,
    };

    componentDidMount() {
        this.refs.nextBlocksIndicator.generateNextBlocks();
        setTimeout(() => {
            this.goNextTurn();
        }, 500)
    }

    goNextTurn() {
        const colorsCount = this.refs.levelIndicator.getLevel();
        if (colorsCount !== this.state.colorsCount)
            this.setState({ colorsCount });
        const specialsCount = this.refs.levelIndicator.getSpecialLevel();
        if (specialsCount !== this.state.specialsCount)
            this.setState({ specialsCount });
        const bonusCount = this.refs.levelIndicator.getBonusLevel();
        if (bonusCount !== this.state.bonusCount)
            this.setState({ bonusCount });

        this.setState({ turn: this.state.turn + 1 })

        const bestStartingPositionX = this.refs.blockGrid.getBestStartingPositionX();
        if (bestStartingPositionX == null)
            return this.youHaveLost();

        this.refs.blockGrid.breakMatchedBlocks(() => {
            this.refs.blockGrid.dropRandomEvents();
            setTimeout(() => {
                const nextBlocks = this.refs.nextBlocksIndicator.getNextBlocks();
                this.refs.blockController.setupNextTurn(nextBlocks, bestStartingPositionX);
                this.refs.nextBlocksIndicator.generateNextBlocks();
            }, 0);
        }, (brokenBlockCount) => {
            if (brokenBlockCount < 3)
                return;
            const addedScore = brokenBlockCount * 2 - 3;
            this.setState({ score: this.state.score + addedScore })
        });
    }

    youHaveLost() {
        this.setState({ gameState: 'end' })
    }

    controllerMovementChecker(movement, position, cells) {
        if (movement === 'down') {
            const controllerCanMove = this.refs.blockGrid.isBlockEmpty(position.x, position.y + 3);
            if (!controllerCanMove) {
                this.refs.blockController.setCantMove();
                setTimeout(() => {
                    this.refs.blockController.dispose();
                    this.refs.blockGrid.injectCells(position.x, position.y, cells);
                    this.goNextTurn();
                }, 0);
            }
            return controllerCanMove;
        }
        if (movement === 'right' || movement === 'left')
            return this.refs.blockGrid.isBlockEmpty(position.x, position.y + 2);
    }

    goDownestInCurrentColumn() {
        const currentPosition = this.refs.blockController.getCurrentPosition();
        const emptyPositionY = this.refs.blockGrid.getFirstEmptyPositionYInColumn(currentPosition.x)
        this.refs.blockController.goDownTo(emptyPositionY - 3);
    }

    render() {
        const cellSize = Math.floor(height / this.props.blocksCount.vertical - 5);
        const blockControllerOffsetY = height - cellSize * (this.props.blocksCount.vertical + 1);

        return (
            <ImageBackground source={backgroundImage} style={styles.gameView}>
                <BlockGrid ref='blockGrid' cellSize={cellSize} style={styles.blockGrid}
                    verticalBlocksCount={this.props.blocksCount.vertical} />
                <ScoreIndicator position={{ top: 5, left: 5 }} title="Score" value={this.state.score} />
                <ScoreIndicator position={{ top: 5, right: 5 }} title="Highest" value={this.state.maxScore} />
                <NextBlocksIndicator ref="nextBlocksIndicator" cellSize={cellSize}
                    position={{ top: 60, right: 20 }}
                    colorsCount={this.state.colorsCount}
                    specialsCount={this.state.specialsCount}
                    bonusCount={this.state.bonusCount} />
                <LevelIndicator ref="levelIndicator"
                    position={{ bottom: 10, right: 20 }}
                    colorsCount={this.state.colorsCount + this.state.bonusCount + this.state.specialsCount}
                    gameScore={this.state.score}
                    cellSize={cellSize} />

                <BlockController ref='blockController' cellSize={cellSize} offsetY={blockControllerOffsetY}
                    movementChecker={e => this.controllerMovementChecker(e.movement, e.position, e.cells)}
                    gameDelay={this.state.gameDelay} />
                <MovementController
                    onRightMove={() => this.refs.blockController.goRight()}
                    onLeftMove={() => this.refs.blockController.goLeft()}
                    onDownMove={() => this.goDownestInCurrentColumn()}
                    onUpMove={() => this.refs.blockController.goCirculation()} />
                <Text style={{ color: 'red', top: 0, left: 0, position: 'absolute' }}>{this.state.turn}</Text>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    gameView: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -8
    },
    blockGrid: {
        position: 'absolute',
        bottom: 5,
        left: 5,
    }
});
