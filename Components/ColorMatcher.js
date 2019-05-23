
const minimumBrickingBlockCount = 3;

export class ColorMatcher {

    static _findBreakingMatrix(cells) {
        const breakingMatrix = cells.map(column => (
            column.map(() => false)
        ));

        ColorMatcher._findBreakingBlocksVertically(cells, breakingMatrix);
        ColorMatcher._findBreakingBlocksHorizontally(cells, breakingMatrix);
        ColorMatcher._findBreakingBlocksInclinedToTopRight(cells, breakingMatrix);
        ColorMatcher._findBreakingBlocksInclinedToBottomRight(cells, breakingMatrix);

        return breakingMatrix;
    }


    static _isBreakColorsMatch(color1, color2) {
        if (!color1 || !color2)
            return false;
        if (color1 == 101 || color2 == 101)
            return true;
        return (color1 % 100 == color2 % 100)
    }

    static _findBreakingBlocksInclinedToBottomRight(cells, breakingMatrix) {
        const h = cells[0].length
        const w = cells.length;
        for (let k = -w + 1; k < h; k++) {
            let prevBrick = 0;
            let prevBrickCount = 0;

            for (let m = 0; m < w; m++) {

                const j = k + m;
                const i = m;

                if (i >= w || j === h)
                    break;
                if (j < 0)
                    continue;

                const currentCell = cells[i][j];
                if (prevBrick !== 0 && ColorMatcher._isBreakColorsMatch(currentCell, prevBrick)) {
                    prevBrickCount++;
                }

                if (prevBrick === 0 || i === w - 1 || j === h - 1 || !ColorMatcher._isBreakColorsMatch(currentCell, prevBrick)) {
                    if (prevBrickCount >= minimumBrickingBlockCount) {
                        if (ColorMatcher._isBreakColorsMatch(currentCell, prevBrick) && (i === w - 1 || j === h - 1)) {
                            i++;
                            j++;
                        }
                        for (let o = 0; o < prevBrickCount; o++)
                            breakingMatrix[i - o - 1][j - o - 1] = true;
                    }
                    prevBrickCount = 1;
                }
                prevBrick = currentCell;
            }
        }
    }

    static _findBreakingBlocksInclinedToTopRight(cells, breakingMatrix) {
        const h = cells[0].length;
        const w = cells.length;
        for (let k = 1; k < w + h - 1; k++) {
            let prevBrick = 0;
            let prevBrickCount = 0;

            for (let m = 0; m < w; m++) {

                const j = k - m;
                const i = k - j;

                if (i >= w || j < 0)
                    break;
                if (j >= h)
                    continue;

                const currentCell = cells[i][j];
                if (prevBrick !== 0 && ColorMatcher._isBreakColorsMatch(currentCell, prevBrick)) {
                    prevBrickCount++;
                }

                if (prevBrick === 0 || i === w - 1 || j === 0 || !ColorMatcher._isBreakColorsMatch(currentCell, prevBrick)) {
                    if (prevBrickCount >= minimumBrickingBlockCount) {
                        if (ColorMatcher._isBreakColorsMatch(currentCell, prevBrick) && (i === w - 1 || j === 0)) {
                            i++;
                            j--;
                        }
                        for (let o = 0; o < prevBrickCount; o++)
                            breakingMatrix[i - o - 1][j + o + 1] = true;
                    }
                    prevBrickCount = 1;
                }
                prevBrick = currentCell;
            }
        }
    }

    static _findBreakingBlocksHorizontally(cells, breakingMatrix) {
        const w = cells.length, h = cells[0].length;
        for (let j = 0; j < h; j++) {
            let prevBrick = 0;
            let prevBrickCount = 0;
            for (let i = 0; i <= w; i++) {

                const currentCell = i === w ? 0 : cells[i][j];
                if (prevBrick !== 0 && ColorMatcher._isBreakColorsMatch(currentCell, prevBrick)) {
                    prevBrickCount++;
                }

                if (prevBrick === 0 || !ColorMatcher._isBreakColorsMatch(currentCell, prevBrick)) {
                    if (prevBrickCount >= minimumBrickingBlockCount) {
                        for (let k = 0; k < prevBrickCount; k++)
                            breakingMatrix[i - k - 1][j] = true;
                    }
                    prevBrickCount = 1;
                }
                prevBrick = currentCell;
            }
        }
    }

    static _findBreakingBlocksVertically(cells, breakingMatrix) {
        for (let i = 0; i < cells.length; i++) {
            let prevBrick = 0;
            let prevBrickCount = 0;
            for (let j = breakingMatrix[i].length - 1; j >= 0; j--) {

                const currentCell = cells[i][j];
                if (prevBrick !== 0 && ColorMatcher._isBreakColorsMatch(currentCell, prevBrick)) {
                    prevBrickCount++;
                }

                if (prevBrick === 0 || j == 0 || !ColorMatcher._isBreakColorsMatch(currentCell, prevBrick)) {
                    if (prevBrickCount >= minimumBrickingBlockCount) {
                        for (let k = 0; k < prevBrickCount; k++)
                            breakingMatrix[i][j + k + 1] = true;

                    }
                    prevBrickCount = 1;
                }

                if (currentCell == 0)
                    break;
                prevBrick = currentCell;
            }
        }
    }
}