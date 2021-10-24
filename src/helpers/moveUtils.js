import { getPos } from "./boardUtils";

const findValidMoves = (from, { board, currentPlayer }) => {
    if (from instanceof HTMLElement) {
        from = getPos(from);
    }
    const validMoves = [];
    for (let [rowIndex, row] of board.entries()) {
        for (let [colIndex] of row.entries()) {
            let to = { row: rowIndex, col: colIndex };
            if (isValidMove(from, to, { board, currentPlayer })) {
                validMoves.push(to);
            }
        }
    }
    return validMoves;
};

const findValidClaims = (from, { board, currentPlayer }) => {
    if (from instanceof HTMLElement) {
        from = getPos(from);
    }
    const validClaims = [];
    for (let [rowIndex, row] of board.entries()) {
        for (let [colIndex] of row.entries()) {
            let to = { row: rowIndex, col: colIndex };
            if (isValidClaim(from, to, { board, currentPlayer })) {
                validClaims.push(to);
            }
        }
    }
    return validClaims;
};

const findAllValidMoves = ({ board, currentPlayer }) => {
    const validMoves = [];
    for (let [rowIndex, row] of board.entries()) {
        for (let [colIndex] of row.entries()) {
            let validMove = findValidMoves(
                { row: rowIndex, col: colIndex },
                { board, currentPlayer }
            );
            if (validMove.length > 0) {
                validMoves.push({ row: rowIndex, col: colIndex });
            }
        }
    }
    return validMoves;
};

const findAllValidClaims = ({ board, currentPlayer }) => {
    const validMoves = [];
    for (let [rowIndex, row] of board.entries()) {
        for (let [colIndex] of row.entries()) {
            let validMove = findValidClaims(
                { row: rowIndex, col: colIndex },
                { board, currentPlayer }
            );
            if (validMove.length > 0) {
                validMoves.push({ row: rowIndex, col: colIndex });
            }
        }
    }
    return validMoves;
};

/**
 *  Check whether move is valid
 * @param {Object} - "FROM" coordinates. Object has to contain 'row' and 'col' properties
 * @param {Object} - "TO" coordinates. Object has to contain 'row' and 'col' properties
 * @param {String} - Current player name
 * @returns {Boolean} Boolean
 */
const isValidMove = (
    { row: fR, col: fC },
    { row: tR, col: tC },
    { board, currentPlayer }
) => {
    // Normal 1-length diagonal move
    if (
        board[fR][fC].player === currentPlayer && // Piece belongs to current player
        tR - fR === (currentPlayer === "white" ? -1 : 1) && // First part of 1-length diagonal check (-1 or +1 depending on player)
        Math.abs(tC - fC) === 1 && // Second part of 1-length diagonal check
        !board[tR][tC].player // Check if a tile is NOT occupied
    ) {
        return true;
    }
    return false;
};

const isValidClaim = (
    { row: fR, col: fC },
    { row: tR, col: tC },
    { board, currentPlayer }
) => {
    // 2-length diagonal claiming move
    if (
        board[fR][fC].player === currentPlayer && // Piece belongs to current player
        Math.abs(fR - tR) === 2 && // First part of 2-length diagonal check
        Math.abs(fC - tC) === 2 && // Second part of 2-length diagonal check
        !board[tR][tC].player && // Check if a tile is occupied
        board[(fR + tR) / 2][(fC + tC) / 2].player !== currentPlayer && // Check if middle tile is NOT occupied by current player
        board[(fR + tR) / 2][(fC + tC) / 2].player // Check if middle tile is occupied
    ) {
        return true;
    }
    return false;
};

const handlePieceMouseLeave = e => {
    document.querySelectorAll(".tile").forEach(el => {
        el.classList.remove("tile-valid-move");
        el.classList.remove("tile-valid-claim");
    });
};

const handlePieceMouseOver = (el, gameState) => {
    const allValidClaims = findAllValidClaims(gameState);
    if (allValidClaims.length > 0) {
        const validClaims = findValidClaims(el, gameState);
        if (validClaims.length > 0) {
            validClaims.forEach(pos => {
                document
                    .querySelector(
                        `.tile[data-row="${pos.row}"][data-col="${pos.col}"]`
                    )
                    .classList.add("tile-valid-claim");
            });
        }
    } else {
        findValidMoves(el, gameState).forEach(pos => {
            document
                .querySelector(`.tile[data-row="${pos.row}"][data-col="${pos.col}"]`)
                .classList.add("tile-valid-move");
        });
    }
};

export {
    isValidClaim,
    isValidMove,
    findValidMoves,
    findAllValidMoves,
    findValidClaims,
    findAllValidClaims,
    handlePieceMouseLeave,
    handlePieceMouseOver
};
