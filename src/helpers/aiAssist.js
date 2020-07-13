export default function ai_move(board, boardDimension, ai, player) {
    let score = {
        // openTwo: 10,
        // openThree: 100000,
        // cappedThree: 10000,
        // openFour: 1000000000,
        // cappedFour: 1000500000,
        // gappedThree: 100000,
        // gappedFour: 1000500000,
        // consecutiveFive: 1000000000000,

        "openTwo": 1000,
        "openThree": 100000,
        "cappedThree": 10000,
        "openFour": 1000000,
        "cappedFour": 100050,
        "gappedThree": 100000,
        "gappedFour": 100050,
        "consecutiveFive": 100000000
    };

    function getValidMoves(board) {
        function isValid(x, y) {
            if (
                x < 0 ||
                x >= boardDimension ||
                y < 0 ||
                y >= boardDimension ||
                board[x][y] !== 0
            )
                return false;
            return true;
        }

        /**
         * @param x
         * @param y
         * @returns A list of 3x3 (possible) moves from the center cell
         */
        function retrieve(x, y) {
            let lis = [];
            for (let i = -1; i <= 1; i++)
                for (let j = -1; j <= 1; j++)
                    if (isValid(x + i, y + j) && Math.abs(i) + Math.abs(j) < 4)
                        lis.push([x + i, y + j]);
            return lis;
        }

        let check = [];
        let id = 0;
        for (let i = 0; i <= boardDimension; i++)
            check.push(new Array(boardDimension + 1).fill(false));
        let lis = [];
        for (let i = 0; i < boardDimension; i++)
            for (let j = 0; j < boardDimension; j++)
                if (board[i][j] !== 0)
                    retrieve(i, j).forEach((tuple) => {
                        if (!check[tuple[0]][tuple[1]]) {
                            lis.push({ id: ++id, tuple: tuple });
                            check[tuple[0]][tuple[1]] = true;
                        }
                    });
        return lis;
    }

    function checkHorizontal(x, y, next) {
        let oppo = 0,
            prop = 0;
        for (let i = y; i < y + next; i++)
            if (board[x][i] !== undefined) {
                prop += board[x][i] === ai;
                oppo += board[x][i] === player;
            }
        return [prop, oppo];
    }

    /**
     * @param {*} x row-th
     * @param {*} y column-th
     * @param {*} next number of moves to be checked forward
     * @returns An array of 2 elements representing number of proponents and opponents
     */
    function checkVertical(x, y, next) {
        let oppo = 0,
            prop = 0;
        for (let i = x; i < x + next; i++)
            if (board[i] !== undefined) {
                prop += board[i][y] === ai;
                oppo += board[i][y] === player;
            }
        return [prop, oppo];
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
                prop = 0;
            for (let i = 0; i < next; i++)
                if (board[x + i] !== undefined) {
                    prop += board[x + i][y + i] === ai;
                    oppo += board[x + i][y + i] === player;
                }
            return [prop, oppo];
        }

        function leftDiagonal() {
            let oppo = 0,
                prop = 0;
            for (let i = 0; i < next; i++)
                if (board[x + i] !== undefined) {
                    prop += board[x + i][y - i] === ai;
                    oppo += board[x + i][y - i] === player;
                }
            return [prop, oppo];
        }
        return [leftDiagonal(), rightDiagonal()];
    }

    /**
     *
     * @param {*} currentP The player that open-2 patterns respect to
     * @returns The number of open-2 patterns with respect to 'currentP'
     */
    function openTwo(currentP, x = null, y = null) {
        let res = 0;
        if (!x && !y) {
            for (let i = 0; i < boardDimension; i++)
                for (let j = 0; j < boardDimension; j++) {
                    let [prop, oppo] = checkHorizontal(i, j, 2);
                    if (currentP === player) [prop, oppo] = [oppo, prop];
                    if (
                        prop === 2 &&
                        board[i][j - 1] === 0 &&
                        board[i][j + 2] === 0
                    )
                        res++;

                    [prop, oppo] = checkVertical(i, j, 2);
                    if (currentP === player) [prop, oppo] = [oppo, prop];
                    if (
                        prop === 2 &&
                        board[i - 1] &&
                        board[i + 2] &&
                        board[i - 1][j] === 0 &&
                        board[i + 2][j] === 0
                    )
                        res++;

                    let [left, right] = checkDiagonal(i, j, 2);
                    [prop, oppo] = left;
                    if (currentP === player) [prop, oppo] = [oppo, prop];
                    if (
                        prop === 2 &&
                        board[i - 1] &&
                        board[i + 2] &&
                        board[i - 1][j + 1] === 0 &&
                        board[i + 2][j - 2] === 0
                    )
                        res++;
                    [prop, oppo] = right;
                    if (currentP === player) [prop, oppo] = [oppo, prop];
                    if (
                        prop === 2 &&
                        board[i - 1] &&
                        board[i + 2] &&
                        board[i - 1][j - 1] === 0 &&
                        board[i + 2][j + 2] === 0
                    )
                        res++;
                }
        } else {
            let [prop, oppo] = checkHorizontal(x, y, 2);
            if (currentP === player) [prop, oppo] = [oppo, prop];
            if (prop === 2 && board[x][y - 1] === 0 && board[x][y + 2] === 0)
                res++;

            [prop, oppo] = checkVertical(x, y, 2);
            if (currentP === player) [prop, oppo] = [oppo, prop];
            if (
                prop === 2 &&
                board[x - 1] &&
                board[x + 2] &&
                board[x - 1][y] === 0 &&
                board[x + 2][y] === 0
            )
                res++;

            let [left, right] = checkDiagonal(x, y, 2);
            [prop, oppo] = left;
            if (currentP === player) [prop, oppo] = [oppo, prop];
            if (
                prop === 2 &&
                board[x - 1] &&
                board[x + 2] &&
                board[x - 1][y + 1] === 0 &&
                board[x + 2][y - 2] === 0
            )
                res++;
            [prop, oppo] = right;
            if (currentP === player) [prop, oppo] = [oppo, prop];
            if (
                prop === 2 &&
                board[x - 1] &&
                board[x + 2] &&
                board[x - 1][y - 1] === 0 &&
                board[x + 2][y + 2] === 0
            )
                res++;
        }
        return res;
    }

    /**
     *
     * @param {*} currentP The player that open-3 and capped-3 patterns respect to
     * @returns An array representing the number of open-3 and capped-3 patterns with respect to 'currentP'
     */
    function open_capped_Three(currentP, x = null, y = null) {
        let reso3 = 0,
            resc3 = 0;
        if (!x && !y) {
            for (let i = 0; i < boardDimension; i++)
                for (let j = 0; j < boardDimension; j++) {
                    let [prop, oppo] = checkHorizontal(i, j, 3);
                    if (currentP === player) [prop, oppo] = [oppo, prop];
                    if (
                        prop === 3 &&
                        board[i][j - 1] === 0 &&
                        board[i][j + 3] === 0
                    )
                        reso3++;
                    if (
                        prop === 3 &&
                        board[i][j - 1] + board[i][j + 3] === -1 * currentP
                    )
                        resc3++;

                    [prop, oppo] = checkVertical(i, j, 3);
                    if (currentP === player) [prop, oppo] = [oppo, prop];
                    if (
                        prop === 3 &&
                        board[i - 1] &&
                        board[i + 3] &&
                        board[i - 1][j] === 0 &&
                        board[i + 3][j] === 0
                    )
                        reso3++;
                    if (
                        prop === 3 &&
                        board[i - 1] &&
                        board[i + 3] &&
                        board[i - 1][j] + board[i + 3][j] === -1 * currentP
                    )
                        resc3++;

                    let [left, right] = checkDiagonal(i, j, 3);
                    [prop, oppo] = left;
                    if (currentP === player) [prop, oppo] = [oppo, prop];
                    if (
                        prop === 3 &&
                        board[i - 1] &&
                        board[i + 3] &&
                        board[i - 1][j + 1] === 0 &&
                        board[i + 3][j - 3] === 0
                    )
                        reso3++;
                    if (
                        prop === 3 &&
                        board[i - 1] &&
                        board[i + 3] &&
                        board[i - 1][j + 1] + board[i + 3][j - 3] ===
                        -1 * currentP
                    )
                        resc3++;
                    [prop, oppo] = right;
                    if (currentP === player) [prop, oppo] = [oppo, prop];
                    if (
                        prop === 3 &&
                        board[i - 1] &&
                        board[i + 3] &&
                        board[i - 1][j - 1] === 0 &&
                        board[i + 3][j + 3] === 0
                    )
                        reso3++;
                    if (
                        prop === 3 &&
                        board[i - 1] &&
                        board[i + 3] &&
                        board[i - 1][j - 1] + board[i + 3][j + 3] ===
                        -1 * currentP
                    )
                        resc3++;
                }
        } else {
            let [prop, oppo] = checkHorizontal(x, y, 3);
            if (currentP === player) [prop, oppo] = [oppo, prop];
            if (prop === 3 && board[x][y - 1] === 0 && board[x][y + 3] === 0)
                reso3++;
            if (
                prop === 3 &&
                board[x][y - 1] + board[x][y + 3] === -1 * currentP
            )
                resc3++;

            [prop, oppo] = checkVertical(x, y, 3);
            if (currentP === player) [prop, oppo] = [oppo, prop];
            if (
                prop === 3 &&
                board[x - 1] &&
                board[x + 3] &&
                board[x - 1][y] === 0 &&
                board[x + 3][y] === 0
            )
                reso3++;
            if (
                prop === 3 &&
                board[x - 1] &&
                board[x + 3] &&
                board[x - 1][y] + board[x + 3][y] === -1 * currentP
            )
                resc3++;

            let [left, right] = checkDiagonal(x, y, 3);
            [prop, oppo] = left;
            if (currentP === player) [prop, oppo] = [oppo, prop];
            if (
                prop === 3 &&
                board[x - 1] &&
                board[x + 3] &&
                board[x - 1][y + 1] === 0 &&
                board[x + 3][y - 3] === 0
            )
                reso3++;
            if (
                prop === 3 &&
                board[x - 1] &&
                board[x + 3] &&
                board[x - 1][y + 1] + board[x + 3][y - 3] === -1 * currentP
            )
                resc3++;
            [prop, oppo] = right;
            if (currentP === player) [prop, oppo] = [oppo, prop];
            if (
                prop === 3 &&
                board[x - 1] &&
                board[x + 3] &&
                board[x - 1][y - 1] === 0 &&
                board[x + 3][y + 3] === 0
            )
                reso3++;
            if (
                prop === 3 &&
                board[x - 1] &&
                board[x + 3] &&
                board[x - 1][y - 1] + board[x + 3][y + 3] === -1 * currentP
            )
                resc3++;
        }

        return [reso3, resc3];
    }

    /**
     *
     * @param {*} currentP The player that open-4 and capped-4 patterns respect to
     * @returns An array representing the number of open-4 and capped-4 patterns with respect to 'currentP'
     */
    function open_capped_Four(currentP, x = null, y = null) {
        let reso4 = 0,
            resc4 = 0;
        if (!x && !y) {
            for (let i = 0; i < boardDimension; i++)
                for (let j = 0; j < boardDimension; j++) {
                    let [prop, oppo] = checkHorizontal(i, j, 4);
                    if (currentP === player) [prop, oppo] = [oppo, prop];
                    if (
                        prop === 4 &&
                        board[i][j - 1] === 0 &&
                        board[i][j + 4] === 0
                    )
                        reso4++;
                    if (
                        prop === 4 &&
                        board[i][j - 1] + board[i][j + 4] === -1 * currentP
                    )
                        resc4++;

                    [prop, oppo] = checkVertical(i, j, 4);
                    if (currentP === player) [prop, oppo] = [oppo, prop];
                    if (
                        prop === 4 &&
                        board[i - 1] &&
                        board[i + 4] &&
                        board[i - 1][j] === 0 &&
                        board[i + 4][j] === 0
                    )
                        reso4++;
                    if (
                        prop === 4 &&
                        board[i - 1] &&
                        board[i + 4] &&
                        board[i - 1][j] + board[i + 4][j] === -1 * currentP
                    )
                        resc4++;

                    let [left, right] = checkDiagonal(i, j, 4);
                    [prop, oppo] = left;
                    if (currentP === player) [prop, oppo] = [oppo, prop];
                    if (
                        prop === 4 &&
                        board[i - 1] &&
                        board[i + 4] &&
                        board[i - 1][j + 1] === 0 &&
                        board[i + 4][j - 4] === 0
                    )
                        reso4++;
                    if (
                        prop === 4 &&
                        board[i - 1] &&
                        board[i + 4] &&
                        board[i - 1][j + 1] + board[i + 4][j - 4] ===
                        -1 * currentP
                    )
                        resc4++;
                    [prop, oppo] = right;
                    if (currentP === player) [prop, oppo] = [oppo, prop];
                    if (
                        prop === 4 &&
                        board[i - 1] &&
                        board[i + 4] &&
                        board[i - 1][j - 1] === 0 &&
                        board[i + 4][j + 4] === 0
                    )
                        reso4++;
                    if (
                        prop === 4 &&
                        board[i - 1] &&
                        board[i + 4] &&
                        board[i - 1][j - 1] + board[i + 4][j + 4] ===
                        -1 * currentP
                    )
                        resc4++;
                }
        } else {
            let [prop, oppo] = checkHorizontal(x, y, 4);
            if (currentP === player) [prop, oppo] = [oppo, prop];
            if (prop === 4 && board[x][y - 1] === 0 && board[x][y + 4] === 0)
                reso4++;
            if (
                prop === 4 &&
                board[x][y - 1] + board[x][y + 4] === -1 * currentP
            )
                resc4++;

            [prop, oppo] = checkVertical(x, y, 4);
            if (currentP === player) [prop, oppo] = [oppo, prop];
            if (
                prop === 4 &&
                board[x - 1] &&
                board[x + 4] &&
                board[x - 1][y] === 0 &&
                board[x + 4][y] === 0
            )
                reso4++;
            if (
                prop === 4 &&
                board[x - 1] &&
                board[x + 4] &&
                board[x - 1][y] + board[x + 4][y] === -1 * currentP
            )
                resc4++;

            let [left, right] = checkDiagonal(x, y, 4);
            [prop, oppo] = left;
            if (currentP === player) [prop, oppo] = [oppo, prop];
            if (
                prop === 4 &&
                board[x - 1] &&
                board[x + 4] &&
                board[x - 1][y + 1] === 0 &&
                board[x + 4][y - 4] === 0
            )
                reso4++;
            if (
                prop === 4 &&
                board[x - 1] &&
                board[x + 4] &&
                board[x - 1][y + 1] + board[x + 4][y - 4] === -1 * currentP
            )
                resc4++;
            [prop, oppo] = right;
            if (currentP === player) [prop, oppo] = [oppo, prop];
            if (
                prop === 4 &&
                board[x - 1] &&
                board[x + 4] &&
                board[x - 1][y - 1] === 0 &&
                board[x + 4][y + 4] === 0
            )
                reso4++;
            if (
                prop === 4 &&
                board[x - 1] &&
                board[x + 4] &&
                board[x - 1][y - 1] + board[x + 4][y + 4] === -1 * currentP
            )
                resc4++;
        }

        return [reso4, resc4];
    }

    /**
     *
     * @param {*} currentP The player that gapped-3 patterns respect to
     * @returns An array representing the number of gapped-3 patterns with respect to 'currentP'
     */
    function gappedThree(currentP, x = null, y = null) {
        let res = 0;
        if (!x && !y) {
            for (let i = 0; i < boardDimension; i++)
                for (let j = 0; j < boardDimension; j++) {
                    let [prop, oppo] = checkHorizontal(i, j, 4);
                    if (currentP === player) [prop, oppo] = [oppo, prop];
                    if (
                        prop === 3 &&
                        oppo === 0 &&
                        board[i][j] === currentP &&
                        board[i][j + 3] === currentP &&
                        board[i][j - 1] === 0 &&
                        board[i][j + 4] === 0
                    )
                        res++;

                    [prop, oppo] = checkVertical(i, j, 4);
                    if (currentP === player) [prop, oppo] = [oppo, prop];
                    if (
                        prop === 3 &&
                        oppo === 0 &&
                        board[i - 1] &&
                        board[i + 4] &&
                        board[i][j] === currentP &&
                        board[i + 3][j] === currentP &&
                        board[i - 1][j] === 0 &&
                        board[i + 4][j] === 0
                    )
                        res++;

                    let [left, right] = checkDiagonal(i, j, 4);
                    [prop, oppo] = left;
                    if (currentP === player) [prop, oppo] = [oppo, prop];
                    if (
                        prop === 3 &&
                        oppo === 0 &&
                        board[i - 1] &&
                        board[i + 4] &&
                        board[i][j] === currentP &&
                        board[i + 3][j - 3] === currentP &&
                        board[i - 1][j + 1] === 0 &&
                        board[i + 4][j - 4] === 0
                    )
                        res++;
                    [prop, oppo] = right;
                    if (currentP === player) [prop, oppo] = [oppo, prop];
                    if (
                        prop === 3 &&
                        oppo === 0 &&
                        board[i - 1] &&
                        board[i + 4] &&
                        board[i][j] === currentP &&
                        board[i + 3][j + 3] === currentP &&
                        board[i - 1][j - 1] === 0 &&
                        board[i + 4][j + 4] === 0
                    )
                        res++;
                }
        } else {
            let [prop, oppo] = checkHorizontal(x, y, 4);
            if (currentP === player) [prop, oppo] = [oppo, prop];
            if (
                prop === 3 &&
                oppo === 0 &&
                board[x][y] === currentP &&
                board[x][y + 3] === currentP &&
                board[x][y - 1] === 0 &&
                board[x][y + 4] === 0
            )
                res++;

            [prop, oppo] = checkVertical(x, y, 4);
            if (currentP === player) [prop, oppo] = [oppo, prop];
            if (
                prop === 3 &&
                oppo === 0 &&
                board[x - 1] &&
                board[x + 4] &&
                board[x][y] === currentP &&
                board[x + 3][y] === currentP &&
                board[x - 1][y] === 0 &&
                board[x + 4][y] === 0
            )
                res++;

            let [left, right] = checkDiagonal(x, y, 4);
            [prop, oppo] = left;
            if (currentP === player) [prop, oppo] = [oppo, prop];
            if (
                prop === 3 &&
                oppo === 0 &&
                board[x - 1] &&
                board[x + 4] &&
                board[x][y] === currentP &&
                board[x + 3][y - 3] === currentP &&
                board[x - 1][y + 1] === 0 &&
                board[x + 4][y - 4] === 0
            )
                res++;
            [prop, oppo] = right;
            if (currentP === player) [prop, oppo] = [oppo, prop];
            if (
                prop === 3 &&
                oppo === 0 &&
                board[x - 1] &&
                board[x + 4] &&
                board[x][y] === currentP &&
                board[x + 3][y + 3] === currentP &&
                board[x - 1][y - 1] === 0 &&
                board[x + 4][y + 4] === 0
            )
                res++;
        }

        return res;
    }

    /**
     *
     * @param {*} currentP The player that gapped-4 and consecutive-5 patterns respect to
     * @returns An array representing the number of  gapped-4 and consecutive-5 patterns with respect to 'currentP'
     */
    function gappedFour_consecutiveFive(currentP, x = null, y = null) {
        let resg4 = 0,
            resc5 = 0;
        if (!x && !y) {
            for (let i = 0; i < boardDimension; i++)
                for (let j = 0; j < boardDimension; j++) {
                    let [prop, oppo] = checkHorizontal(i, j, 5);
                    if (currentP === player) [prop, oppo] = [oppo, prop];
                    if (
                        prop === 4 &&
                        oppo === 0 &&
                        board[i][j] === currentP &&
                        board[i][j + 4] === currentP &&
                        board[i][j - 1] + board[i][j + 5] !== -2 * currentP
                    )
                        resg4++;
                    if (
                        prop === 5 &&
                        board[i][j - 1] + board[i][j + 5] !== -2 * currentP
                    )
                        resc5++;

                    [prop, oppo] = checkVertical(i, j, 5);
                    if (currentP === player) [prop, oppo] = [oppo, prop];
                    if (
                        prop === 4 &&
                        oppo === 0 &&
                        board[i - 1] &&
                        board[i + 5] &&
                        board[i][j] === currentP &&
                        board[i + 4][j] === currentP &&
                        board[i - 1][j] + board[i + 5][j] !== -2 * currentP
                    )
                        resg4++;
                    if (
                        prop === 5 &&
                        board[i - 1] &&
                        board[i + 5] &&
                        board[i - 1][j] + board[i + 5][j] !== -2 * currentP
                    )
                        resc5++;

                    let [left, right] = checkDiagonal(i, j, 5);
                    [prop, oppo] = left;
                    if (currentP === player) [prop, oppo] = [oppo, prop];
                    if (
                        prop === 4 &&
                        oppo === 0 &&
                        board[i - 1] &&
                        board[i + 5] &&
                        board[i][j] === currentP &&
                        board[i + 4][j - 4] === currentP &&
                        board[i - 1][j + 1] + board[i + 5][j - 5] !==
                        -2 * currentP
                    )
                        resg4++;
                    if (
                        prop === 5 &&
                        board[i - 1] &&
                        board[i + 5] &&
                        board[i - 1][j + 1] + board[i + 5][j - 5] !==
                        -2 * currentP
                    )
                        resc5++;
                    [prop, oppo] = right;
                    if (currentP === player) [prop, oppo] = [oppo, prop];
                    if (
                        prop === 4 &&
                        oppo === 0 &&
                        board[i - 1] &&
                        board[i + 5] &&
                        board[i][j] === currentP &&
                        board[i + 4][j + 4] === currentP &&
                        board[i - 1][j - 1] + board[i + 5][j + 5] !==
                        -2 * currentP
                    )
                        resg4++;
                    if (
                        prop === 5 &&
                        board[i - 1] &&
                        board[i + 5] &&
                        board[i - 1][j - 1] + board[i + 5][j + 5] !==
                        -2 * currentP
                    )
                        resc5++;
                }
        } else {
            let [prop, oppo] = checkHorizontal(x, y, 5);
            if (currentP === player) [prop, oppo] = [oppo, prop];
            if (
                prop === 4 &&
                oppo === 0 &&
                board[x][y] === currentP &&
                board[x][y + 4] === currentP &&
                board[x][y - 1] + board[x][y + 5] !== -2 * currentP
            )
                resg4++;
            if (
                prop === 5 &&
                board[x][y - 1] + board[x][y + 5] !== -2 * currentP
            )
                resc5++;

            [prop, oppo] = checkVertical(x, y, 5);
            if (currentP === player) [prop, oppo] = [oppo, prop];
            if (
                prop === 4 &&
                oppo === 0 &&
                board[x - 1] &&
                board[x + 5] &&
                board[x][y] === currentP &&
                board[x + 4][y] === currentP &&
                board[x - 1][y] + board[x + 5][y] !== -2 * currentP
            )
                resg4++;
            if (
                prop === 5 &&
                board[x - 1] &&
                board[x + 5] &&
                board[x - 1][y] + board[x + 5][y] !== -2 * currentP
            )
                resc5++;

            let [left, right] = checkDiagonal(x, y, 5);
            [prop, oppo] = left;
            if (currentP === player) [prop, oppo] = [oppo, prop];
            if (
                prop === 4 &&
                oppo === 0 &&
                board[x - 1] &&
                board[x + 5] &&
                board[x][y] === currentP &&
                board[x + 4][y - 4] === currentP &&
                board[x - 1][y + 1] + board[x + 5][y - 5] !== -2 * currentP
            )
                resg4++;
            if (
                prop === 5 &&
                board[x - 1] &&
                board[x + 5] &&
                board[x - 1][y + 1] + board[x + 5][y - 5] !== -2 * currentP
            )
                resc5++;
            [prop, oppo] = right;
            if (currentP === player) [prop, oppo] = [oppo, prop];
            if (
                prop === 4 &&
                oppo === 0 &&
                board[x - 1] &&
                board[x + 5] &&
                board[x][y] === currentP &&
                board[x + 4][y + 4] === currentP &&
                board[x - 1][y - 1] + board[x + 5][y + 5] !== -2 * currentP
            )
                resg4++;
            if (
                prop === 5 &&
                board[x - 1] &&
                board[x + 5] &&
                board[x - 1][y - 1] + board[x + 5][y + 5] !== -2 * currentP
            )
                resc5++;
        }

        return [resg4, resc5];
    }

    function getGameState(aiStates, playerStates) {
        return (
            score["openTwo"] * (aiStates["openTwo"] - playerStates["openTwo"]) +
            score["openThree"] *
            (aiStates["openThree"] - playerStates["openThree"]) +
            score["gappedThree"] *
            (aiStates["gappedThree"] - playerStates["gappedThree"]) +
            score["cappedThree"] *
            (aiStates["cappedThree"] - playerStates["cappedThree"]) +
            score["openFour"] *
            (aiStates["openFour"] - playerStates["openFour"]) +
            score["gappedFour"] *
            (aiStates["gappedFour"] - playerStates["gappedFour"]) +
            score["cappedFour"] *
            (aiStates["cappedFour"] - playerStates["cappedFour"]) +
            score["consecutiveFive"] *
            (aiStates["consecutiveFive"] - playerStates["consecutiveFive"])
        );
    }

    function getStatesOf(gamer, states, x, y) {
        let statesClone = { ...states };
        if (x && y) {
            function validCoord(xx, yy) {
                return (
                    xx >= 0 &&
                    xx < boardDimension &&
                    yy >= 0 &&
                    yy < boardDimension
                );
            }

            let directions = [
                [-1, -1, 1, 1],
                [-1, 0, 1, 0],
                [-1, 1, 1, -1],
                [0, -1, 0, 1],
            ];
            if (gamer === board[x][y]) {
                // extending
                for (let dir of directions) {
                    let endsWithBlank1 = true,
                        endsWithBlank2 = true;
                    let x1 = x + dir[0],
                        y1 = y + dir[1],
                        x2 = x + dir[2],
                        y2 = y + dir[3];
                    let cnt1 = 0,
                        cnt2 = 0;
                    while (validCoord(x1, y1)) {
                        if (board[x1][y1] === 0) break;
                        else if (board[x1][y1] !== gamer) {
                            endsWithBlank1 = false;
                            break;
                        }

                        x1 += dir[0];
                        y1 += dir[1];
                        cnt1++;
                    }
                    while (validCoord(x2, y2)) {
                        if (board[x2][y2] === 0) break;
                        else if (board[x2][y2] !== gamer) {
                            endsWithBlank2 = false;
                            break;
                        }

                        x2 += dir[2];
                        y2 += dir[3];
                        cnt2++;
                    }

                    if (!validCoord(x1, y1)) endsWithBlank1 = false;
                    if (!validCoord(x2, y2)) endsWithBlank2 = false;

                    if (!endsWithBlank1 && !endsWithBlank2) {
                        // pattern has been blocked both sides, no changes need to be done to the states
                        if (
                            cnt1 + cnt2 + 1 === 5 &&
                            (!validCoord(x1, y1) || !validCoord(x2, y2))
                        )
                            statesClone["consecutiveFive"]++;
                    } else if (endsWithBlank1 && endsWithBlank2) {
                        // pattern is free on both sides
                        if (cnt1 + cnt2 === 3 && cnt1 !== 0 && cnt2 !== 0)
                            // if pattern is gapped three
                            statesClone["gappedThree"]--;
                        else if (cnt1 + cnt2 === 4 && cnt1 !== 0 && cnt2 !== 0)
                            // if pattern is gapped four
                            statesClone["gappedFour"]--;
                        else if (cnt1 + cnt2 === 3) statesClone["openThree"]--;
                        else if (cnt1 + cnt2 === 4) statesClone["openFour"]--;

                        if (cnt1 + cnt2 + 1 === 2) statesClone["openTwo"]++;
                        else if (cnt1 + cnt2 + 1 === 3)
                            statesClone["openThree"]++;
                        else if (cnt1 + cnt2 + 1 === 4)
                            statesClone["openFour"]++;
                        else if (cnt1 + cnt2 + 1 === 5)
                            statesClone["consecutiveFive"]++;
                    } // one side is blocked, the other side is free
                    else {
                        if (endsWithBlank1) {
                            // blocked on side 2
                            if (cnt2 === 3) statesClone["cappedThree"]--;
                            else if (cnt2 === 4) statesClone["cappedFour"]--;
                            else if (cnt2 === 5)
                                statesClone["consecutiveFive"]--;
                        } // blocked on side 1
                        else {
                            if (cnt1 === 3) statesClone["cappedThree"]--;
                            else if (cnt1 === 4) statesClone["cappedFour"]--;
                            else if (cnt1 === 5)
                                statesClone["consecutiveFive"]--;
                        }

                        if (cnt1 + cnt2 + 1 === 3) statesClone["cappedThree"]++;
                        else if (cnt1 + cnt2 + 1 === 4)
                            statesClone["cappedFour"]++;
                        else if (cnt1 + cnt2 + 1 === 5)
                            statesClone["consecutiveFive"]++;
                    }
                }
            } // blocking
            else {
                for (let dir of directions) {
                    let endsWithBlank1 = true,
                        endsWithBlank2 = true;
                    let x1 = x + dir[0],
                        y1 = y + dir[1],
                        x2 = x + dir[2],
                        y2 = y + dir[3];
                    let cnt1 = 0,
                        cnt2 = 0;
                    while (validCoord(x1, y1)) {
                        if (board[x1][y1] === 0) break;
                        else if (board[x1][y1] !== gamer) {
                            endsWithBlank1 = false;
                            break;
                        }

                        x1 += dir[0];
                        y1 += dir[1];
                        cnt1++;
                    }
                    while (validCoord(x2, y2)) {
                        if (board[x2][y2] === 0) break;
                        else if (board[x2][y2] !== gamer) {
                            endsWithBlank2 = false;
                            break;
                        }

                        x2 += dir[2];
                        y2 += dir[3];
                        cnt2++;
                    }

                    if (!validCoord(x1, y1)) endsWithBlank1 = false;
                    if (!validCoord(x2, y2)) endsWithBlank2 = false;

                    // console.log(dir)
                    // console.log(cnt1 + " " + cnt2);
                    // console.log(endsWithBlank1 + " " + endsWithBlank2);

                    if (!endsWithBlank1 && !endsWithBlank2)
                        // pattern has been blocked both sides, no changes need to be done to the states
                        continue;
                    else if (endsWithBlank1 && endsWithBlank2) {
                        // pattern is free on both sides
                        if (cnt1 + cnt2 === 3 && cnt1 !== 0 && cnt2 !== 0)
                            // if pattern is gapped three
                            statesClone["gappedThree"]--;
                        else if (cnt1 + cnt2 === 4 && cnt1 !== 0 && cnt2 !== 0)
                            // if pattern is gapped four
                            statesClone["gappedFour"]--;
                        else if (
                            cnt1 + cnt2 === 2 &&
                            (cnt1 === 0 || cnt2 === 0)
                        )
                            statesClone["openTwo"]--;

                        if (cnt1 === 3 || cnt2 === 3)
                            statesClone["cappedThree"]++;
                        else if (cnt1 === 4 || cnt2 === 4)
                            statesClone["cappedFour"]++;
                    } // one side is blocked, the other side is free
                    else {
                        // console.log("goes here");
                        if (endsWithBlank1) {
                            // blocked on side 2
                            // console.log('line 728');
                            if (cnt2 === 3) statesClone["cappedThree"]--;
                            else if (cnt2 === 4) statesClone["cappedFour"]--;
                            else if (cnt2 === 5)
                                statesClone["consecutiveFive"]--;

                            if (cnt1 === 3) statesClone["cappedThree"]++;
                            else if (cnt1 === 4) statesClone["cappedFour"]++;
                        } // blocked on side 1
                        else {
                            // console.log('line 743');
                            if (cnt1 === 3) statesClone["cappedThree"]--;
                            else if (cnt1 === 4) statesClone["cappedFour"]--;
                            else if (cnt1 === 5)
                                statesClone["consecutiveFive"]--;

                            if (cnt2 === 3) statesClone["cappedThree"]++;
                            else if (cnt2 === 4) statesClone["cappedFour"]++;
                        }
                    }
                }
            }
        } else {
            if (gamer === ai) {
                let [
                    o2_ai,
                    [o3_ai, c3_ai],
                    g3_ai,
                    [o4_ai, c4_ai],
                    [g4_ai, c5_ai],
                ] = [
                        openTwo(ai),
                        open_capped_Three(ai),
                        gappedThree(ai),
                        open_capped_Four(ai),
                        gappedFour_consecutiveFive(ai),
                    ];
                statesClone["openTwo"] = o2_ai;
                statesClone["openThree"] = o3_ai;
                statesClone["cappedThree"] = c3_ai;
                statesClone["gappedThree"] = g3_ai;
                statesClone["openFour"] = o4_ai;
                statesClone["cappedFour"] = c4_ai;
                statesClone["gappedFour"] = g4_ai;
                statesClone["consecutiveFive"] = c5_ai;
            } else {
                let [
                    o2_player,
                    [o3_player, c3_player],
                    g3_player,
                    [o4_player, c4_player],
                    [g4_player, c5_player],
                ] = [
                        openTwo(player),
                        open_capped_Three(player),
                        gappedThree(player),
                        open_capped_Four(player),
                        gappedFour_consecutiveFive(player),
                    ];
                statesClone["openTwo"] = o2_player;
                statesClone["openThree"] = o3_player;
                statesClone["cappedThree"] = c3_player;
                statesClone["gappedThree"] = g3_player;
                statesClone["openFour"] = o4_player;
                statesClone["cappedFour"] = c4_player;
                statesClone["gappedFour"] = g4_player;
                statesClone["consecutiveFive"] = c5_player;
            }
        }

        return statesClone;
    }

    function minimax(
        board,
        isMaximizing,
        aiStates,
        playerStates,
        alpha = -10000000000000,
        beta = 10000000000000,
        depth = 1
    ) {
        if (
            depth === 0 ||
            aiStates["consecutiveFive"] !== 0 ||
            playerStates["consecutiveFive"] !== 0
        )
            return getGameState(aiStates, playerStates);
        // return getGameState(getStatesOf(ai, ai_states), getStatesOf(player, player_states));

        let best = isMaximizing ? -10000000000000 : 10000000000000;
        for (let i = 0; i < validMoves.length; i++)
            if (!checkValidMoves[validMoves[i].id]) {
                let move = validMoves[i];
                checkValidMoves[move.id] = true;
                board[move.tuple[0]][move.tuple[1]] = isMaximizing
                    ? ai
                    : player;
                let aiNewStates = getStatesOf(
                    ai,
                    aiStates,
                    move.tuple[0],
                    move.tuple[1]
                );
                let playerNewStates = getStatesOf(
                    player,
                    playerStates,
                    move.tuple[0],
                    move.tuple[1]
                );
                // let aiNewStates = getStatesOf(ai, aiStates);
                // let playerNewStates = getStatesOf(player, playerStates);
                let score = minimax(
                    board,
                    !isMaximizing,
                    aiNewStates,
                    playerNewStates,
                    -beta,
                    -alpha,
                    depth - 1
                );
                board[move.tuple[0]][move.tuple[1]] = 0;
                checkValidMoves[move.id] = false;
                best = isMaximizing
                    ? Math.max(best, score)
                    : Math.min(best, score);
                if (isMaximizing) alpha = Math.max(alpha, best);
                if (beta <= alpha) break;
            }

        return best;
    }

    function negascout(
        board,
        isMaximizing,
        aiStates,
        playerStates,
        alpha = -10000000000000,
        beta = 10000000000000,
        depth = 3
    ) {
        if (
            depth === 0 ||
            aiStates["consecutiveFive"] !== 0 ||
            playerStates["consecutiveFive"] !== 0
        )
            return (
                (isMaximizing ? 1 : -1) * getGameState(aiStates, playerStates)
            );

        for (let i = 0; i < validMoves.length; i++)
            if (!checkValidMoves[validMoves[i].id]) {
                checkValidMoves[validMoves[i].id] = true;
                let move = validMoves[i].tuple;
                board[move[0]][move[1]] = isMaximizing ? ai : player;
                let aiNewStates = getStatesOf(ai, aiStates, move[0], move[1]);
                let playerNewStates = getStatesOf(
                    player,
                    playerStates,
                    move[0],
                    move[1]
                );
                let cur;
                if (i === 0)
                    cur = -negascout(
                        board,
                        !isMaximizing,
                        aiNewStates,
                        playerNewStates,
                        -beta,
                        -alpha,
                        depth - 1
                    );
                else {
                    cur = -negascout(
                        board,
                        !isMaximizing,
                        aiNewStates,
                        playerNewStates,
                        -alpha - 1,
                        -alpha,
                        depth - 1
                    );
                    if (cur > alpha && cur < beta)
                        cur = -negascout(
                            board,
                            !isMaximizing,
                            aiNewStates,
                            playerNewStates,
                            -beta,
                            -cur,
                            depth - 1
                        );
                }

                board[move[0]][move[1]] = 0;
                checkValidMoves[validMoves[i].id] = false;

                alpha = Math.max(alpha, cur);
                if (alpha >= beta) break;
            }
        return alpha;
    }

    // for (let row of board)
    //     console.log(row)
    let ai_states = getStatesOf(ai, null),
        player_states = getStatesOf(player, null);
    let validMoves = getValidMoves(board);
    validMoves.sort((aa, bb) => {
        let movei = aa.tuple,
            movej = bb.tuple;
        let heuA, heuB;
        let newSA = ai_states,
            newSP = player_states;

        board[movei[0]][movei[1]] = ai;
        newSA = getStatesOf(ai, newSA, movei[0], movei[1]);
        newSP = getStatesOf(player, newSP, movei[0], movei[1]);
        board[movej[0]][movej[1]] = player;
        newSA = getStatesOf(ai, newSA, movej[0], movej[1]);
        newSP = getStatesOf(player, newSP, movej[0], movej[1]);
        heuA = getGameState(newSA, newSP);
        board[movei[0]][movei[1]] = 0;
        board[movej[0]][movej[1]] = 0;

        newSA = ai_states;
        newSP = player_states;
        board[movej[0]][movej[1]] = ai;
        newSA = getStatesOf(ai, newSA, movej[0], movej[1]);
        newSP = getStatesOf(player, newSP, movej[0], movej[1]);
        board[movei[0]][movei[1]] = player;
        newSA = getStatesOf(ai, newSA, movei[0], movei[1]);
        newSP = getStatesOf(player, newSP, movei[0], movei[1]);
        heuB = getGameState(newSA, newSP);
        board[movei[0]][movei[1]] = 0;
        board[movej[0]][movej[1]] = 0;

        return heuB - heuA;
    });
    let checkValidMoves = new Array(validMoves.length + 2).fill(false);

    let best = -1000000000000000;
    let coordinate = [undefined, undefined];
    for (let i = 0; i < validMoves.length; i++) {
        let move = validMoves[i];
        checkValidMoves[move.id] = true;
        board[move.tuple[0]][move.tuple[1]] = ai;
        let aiNewStates = getStatesOf(
            ai,
            ai_states,
            move.tuple[0],
            move.tuple[1]
        );
        let playerNewStates = getStatesOf(
            player,
            player_states,
            move.tuple[0],
            move.tuple[1]
        );

        let score = -negascout(board, false, aiNewStates, playerNewStates);
        // let score = minimax(board, false, aiNewStates, playerNewStates);
        board[move.tuple[0]][move.tuple[1]] = 0;
        checkValidMoves[move.id] = false;
        // console.log(`(${move.tuple[0]}, ${move.tuple[1]}) has score ${score}`);
        if (best < score) {
            coordinate = move.tuple;
            best = score;
            // chosenStates = [aiNewStates, playerNewStates];
        }
    }
    return coordinate;
}
