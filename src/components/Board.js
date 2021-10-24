import React, {useEffect, useState} from "react";
import Tile from "./Tile";
import {
    getPos,
    getNextPlayer,
    getShift,
    checkIfValidPlayer,
    getPoints,
    getRandomInRange
} from "../helpers/boardUtils";
import {
    isValidMove,
    isValidClaim,
    findAllValidClaims,
    findAllValidMoves,
    findValidMoves,
    findValidClaims
} from "../helpers/moveUtils";
import config from "../helpers/config";

const Board = () => {
    const disposition = localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')) : config;
    const [mousePos, setMousePos] = useState([0, 0]);
    const [draggedEl, setDraggedEl] = useState(null);
    const [dragShift, setDragShift] = useState(null);
    const [gameState, setGameState] = useState(disposition);

    const handleGameStateChange = newState => {
        if (gameState.currentPlayer === 'white') {
            localStorage.setItem('prevState', JSON.stringify(gameState));
        }

        localStorage.setItem('state', JSON.stringify(newState));
        setGameState(newState)
    }

    const undoLastMove = () => {
        const lastMove = localStorage.getItem('prevState');
        localStorage.clear('prevState');
        setGameState(JSON.parse(lastMove))
    }

    const makeDraggable = el => {
        el.style.pointerEvents = "none"
        el.style.position = "fixed";
        el.style.top = mousePos[1] - dragShift[1] + "px";
        el.style.left = mousePos[0] - dragShift[0] + "px";
        el.style.width = el.parentNode.offsetWidth + "px";
        el.style.height = el.parentNode.offsetHeight + "px";
    };

    const windowHandleMouseDown = e => {
        e.preventDefault();
        const {target} = e
        if (
            target.classList.contains("piece") &&
            checkIfValidPlayer(getPos(target.parentNode), gameState) &&
            (draggedEl === null || draggedEl === target)
        ) {
            setDraggedEl(target);
        }
    };

    const dragElement = e => {
        e.preventDefault();
        if (!draggedEl) {
            return
        }

        const {shiftX, shiftY} = getShift(e, draggedEl);
        if (dragShift === null) {
            setDragShift([shiftX, shiftY]);
        } else {
            makeDraggable(draggedEl);
        }
    };

    const movePiece = (from, to) => {
        const fromPos = from.hasOwnProperty('row') ? from : getPos(from);
        const toPos = to.hasOwnProperty('row') ? to : getPos(to);

        const {piece, player} = gameState.board[fromPos.row][fromPos.col];
        const brd = gameState.board.map((row, rowIndex) => {
            return row.map((cell, cellIndex) => {
                if (rowIndex === fromPos.row && cellIndex === fromPos.col) {
                    return {...cell, piece: null, player: null};
                } else if (rowIndex === toPos.row && cellIndex === toPos.col) {
                    return {...cell, piece, player};
                } else {
                    return cell;
                }
            });
        });

        handleGameStateChange({
            ...gameState,
            board: [...brd],
            currentPlayer: getNextPlayer(gameState)
        });
    };

    const moveAndRemovePiece = (from, to) => {
        const fromPos = from.hasOwnProperty('row') ? from : getPos(from);
        const toPos = to.hasOwnProperty('row') ? to : getPos(to);

        const {piece, player} = gameState.board[fromPos.row][fromPos.col];
        const middlePos = {
            row: (fromPos.row + toPos.row) / 2,
            col: (fromPos.col + toPos.col) / 2
        };
        const brd = gameState.board.map((row, rowIndex) => {
            return row.map((cell, cellIndex) => {
                if (rowIndex === fromPos.row && cellIndex === fromPos.col) {
                    return {...cell, piece: null, player: null};
                } else if (rowIndex === toPos.row && cellIndex === toPos.col) {
                    return {...cell, piece, player};
                } else if (rowIndex === middlePos.row && cellIndex === middlePos.col) {
                    return {...cell, piece: null, player: null};
                } else {
                    return cell;
                }
            });
        });

        handleGameStateChange({
            ...gameState,
            board: [...brd],
            currentPlayer: getNextPlayer(gameState)
        });
    };

    const windowHandleMouseUp = e => {
        document.querySelectorAll(".tile").forEach(el => {
            el.classList.remove("tile-valid-move");
        });
        [...document.querySelectorAll(".piece")].map(
            el => (el.style.pointerEvents = "inherit")
        );
        if (draggedEl) {
            draggedEl.style.position = "static";
            draggedEl.style.width = "100%";
            draggedEl.style.height = "100%";
        }


        if (draggedEl && findAllValidClaims(gameState).length === 0) {
            if (
                e.target.classList.contains("tile") &&
                isValidMove(getPos(draggedEl.parentNode), getPos(e.target), gameState)
            ) {
                movePiece(draggedEl.parentNode, e.target);
                e.target.classList.remove("tile-valid-move");
            }
        } else {
            if (
                draggedEl && e.target.classList.contains("tile") &&
                isValidClaim(getPos(draggedEl.parentNode), getPos(e.target), gameState)
            ) {
                moveAndRemovePiece(draggedEl.parentNode, e.target);
                e.target.classList.remove("tile-valid-move");
            }
        }

        setDraggedEl(null);
        setDragShift(null);
    };

    const windowHandleMouseMove = e => {
        dragElement(e);
        setMousePos([e.pageX, e.pageY]);
    };

    const handleButtonClick = () => {
        localStorage.clear('state')
        localStorage.clear('prevState')
        handleGameStateChange(config);
    };

    const {black, white} = getPoints(gameState.board)

    useEffect(() => {
        if (gameState.currentPlayer === 'black') {
            const allValidClaims = findAllValidClaims(gameState);
            const allValidMoves = findAllValidMoves(gameState);

            if (allValidClaims.length) {
                const from = allValidClaims[getRandomInRange(0, allValidClaims.length -1)];
                const claims = findValidClaims(from, gameState);
                const to = claims[getRandomInRange(0, claims.length -1)];
                moveAndRemovePiece(from, to)
                return;
            }

            if (allValidMoves.length) {
                const from = allValidMoves[getRandomInRange(0, allValidMoves.length -1)];
                const moves = findValidMoves(from, gameState);
                const to = moves[getRandomInRange(0, moves.length -1)];
                movePiece(from, to)
            }

        }
    }, [gameState.currentPlayer])

    return (
        <div>
            <header>
                <h1>Current player: {gameState.currentPlayer}</h1>
                <div>
                    <p>Black: {black} pieces</p>
                    <p>White: {white} pieces</p>
                </div>
                <div>
                    <button onClick={handleButtonClick}>Reset game</button>
                    {localStorage.getItem('prevState') && <button onClick={undoLastMove}>Undo move</button>}
                </div>
            </header>

            <div
                className="board"
                data-testid="board"
                onMouseDown={windowHandleMouseDown}
                onMouseMove={windowHandleMouseMove}
                onMouseUp={windowHandleMouseUp}
            >
                { !black || !white ? (
                        <div className='winner-banner' onClick={handleButtonClick}>
                            {black ? 'Black' : 'White'} wins!!!
                        </div>
                    ) : null
                }
                {gameState.board.map((row, rowIndex) => {
                    return row.map((cell, cellIndex) => (
                        <Tile
                            key={`${cellIndex}:${rowIndex}`}
                            gameState={gameState}
                            draggedEl={draggedEl}
                            setDraggedEl={setDraggedEl}
                            rowIndex={rowIndex}
                            cellIndex={cellIndex}
                            cell={cell}
                        />
                    ));
                })}
            </div>
        </div>
    );
};

export default Board;
