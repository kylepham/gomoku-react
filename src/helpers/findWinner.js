export default function findWinner(board, boardDimension, ai, player) {
    function checkHorizontal(x, y, next) {
        let oppo = 0,
            prop = 0,
            line = [];
        for (let i = y; i < y + next; i++)
            if (board[x][i] !== undefined) {
                prop += board[x][i] === ai;
                oppo += board[x][i] === player;
                line.push([x, i]);
            }
        return [prop, oppo, line];
    }

    /**
     * @param {*} x row-th
     * @param {*} y column-th
     * @param {*} next number of moves to be checked forward
     * @returns An array of 2 elements representing number of proponents and opponents
     */
    function checkVertical(x, y, next) {
        let oppo = 0,
            prop = 0,
            line = [];
        for (let i = x; i < x + next; i++)
            if (board[i] !== undefined) {
                prop += board[i][y] === ai;
                oppo += board[i][y] === player;
                line.push([i, y]);
            }
        return [prop, oppo, line];
    }

    /**
     * @param {*} x row-th
     * @param {*} y column-th
     * @param {*} next number of moves to be checked forward
     * @returns An array of 2 elements representing the number of proponents and opponents
     */
    function checkDiagonal(x, y, next) {
        function rightDiagonal() {
            let oppo = 0,
                prop = 0,
                line = [];
            for (let i = 0; i < next; i++)
                if (board[x + i] !== undefined) {
                    prop += board[x + i][y + i] === ai;
                    oppo += board[x + i][y + i] === player;
                    line.push([x + i, y + i]);
                }
            return [prop, oppo, line];
        }

        function leftDiagonal() {
            let oppo = 0,
                prop = 0,
                line = [];
            for (let i = 0; i < next; i++)
                if (board[x + i] !== undefined) {
                    prop += board[x + i][y - i] === ai;
                    oppo += board[x + i][y - i] === player;
                    line.push([x + i, y - i]);
                }
            return [prop, oppo, line];
        }
        return [leftDiagonal(), rightDiagonal()];
    }

    /** -------------------- MAIN -------------------- **/
    for (let i = 0; i < boardDimension; i++)
        for (let j = 0; j < boardDimension; j++) {
            let a = checkHorizontal(i, j, 5);
            if (a[0] === 5 && board[i][j - 1] + board[i][j + 5] !== 2)
                return [ai, a[2]];
            else if (a[1] === 5 && board[i][j - 1] + board[i][j + 5] !== -2)
                return [player, a[2]];

            let b = checkVertical(i, j, 5);
            if (
                b[0] === 5 &&
                board[i - 1] &&
                board[i + 5] &&
                board[i - 1][j] + board[i + 5][j] !== 2
            )
                return [ai, b[2]];
            else if (
                b[1] === 5 &&
                board[i - 1] &&
                board[i + 5] &&
                board[i - 1][j] + board[i + 5][j] !== -2
            )
                return [player, b[2]];

            let [c1, c2] = checkDiagonal(i, j, 5);
            if (
                c1[0] === 5 &&
                board[i - 1] &&
                board[i + 5] &&
                board[i - 1][j + 1] + board[i + 5][j - 5] !== 2
            )
                return [ai, c1[2]];
            else if (
                c1[1] === 5 &&
                board[i - 1] &&
                board[i + 5] &&
                board[i - 1][j + 1] + board[i + 5][j - 5] !== -2
            )
                return [player, c1[2]];
            if (
                c2[0] === 5 &&
                board[i - 1] &&
                board[i + 5] &&
                board[i - 1][j - 1] + board[i + 5][j + 5] !== 2
            )
                return [ai, c2[2]];
            else if (
                c2[1] === 5 &&
                board[i - 1] &&
                board[i + 5] &&
                board[i - 1][j - 1] + board[i + 5][j + 5] !== -2
            )
                return [player, c2[2]];
        }
    return [null, null];
}
