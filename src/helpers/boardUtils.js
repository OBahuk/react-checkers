const getPos = el => {
    return { row: Number(el.dataset.row), col: Number(el.dataset.col) };
};

const getNextPlayer = ({ players, currentPlayer }) => {
    let nextPlayerIndex = players.indexOf(currentPlayer) + 1;
    if (nextPlayerIndex >= players.length) nextPlayerIndex = 0;
    return players[nextPlayerIndex];
};

const getShift = (e, el) => {
    let shiftX = e.clientX - el.getBoundingClientRect().left;
    let shiftY = e.clientY - el.getBoundingClientRect().top;
    return { shiftX, shiftY };
};

const checkIfValidPlayer = ({ row, col }, { currentPlayer, board }) => board[row][col].player === currentPlayer;

const reducer = (acc, item) => {
    if (item.player) {
        acc[item.player] += 1
    }

    return acc;
}

const getPoints = (board) => {
    return board.reduce((acc, item) => {
        const {black, white} = item.reduce(reducer, { black: 0, white: 0 });
        acc.black += black;
        acc.white += white;
        return acc;
    }, {black: 0, white: 0})
}

const getRandomInRange = (start, end) => Math.floor(Math.random() * end) + start

export { getPos, getNextPlayer, getShift, checkIfValidPlayer, getPoints, getRandomInRange };
