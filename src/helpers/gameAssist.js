function checkHorizontal(x, y, next)
{
    let oppo = 0, prop = 0;
    for (let i = y; i < y + next; i++)
        if (board[x][i] !== undefined)
        {
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
function checkVertical(x, y, next)
{
    let oppo = 0, prop = 0;
    for (let i = x; i < x + next; i++)
        if (board[i] !== undefined)
        {
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
function checkDiagonal(x, y, next)
{
    function rightDiagonal()
    {
        let oppo = 0, prop = 0;
        for (let i = 0; i < next; i++)
            if (board[x+i] !== undefined)
            {
                prop += board[x+i][y+i] === ai;
                oppo += board[x+i][y+i] === player;
            }
        return [prop, oppo];
    }
    
    function leftDiagonal()
    {
        let oppo = 0, prop = 0;
        for (let i = 0; i < next; i++)
        if (board[x+i] !== undefined)
            {
                prop += board[x+i][y-i] === ai;
                oppo += board[x+i][y-i] === player;
            }
        return [prop, oppo];
    }
    return [leftDiagonal(), rightDiagonal()];
}