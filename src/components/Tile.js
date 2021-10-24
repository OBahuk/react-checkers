import React, { memo, useEffect, useRef } from "react";
import { findAllValidMoves, findAllValidClaims } from "../helpers/moveUtils";
import Piece from "./Piece";

const Tile = memo(({ gameState, draggedEl, cellIndex, cell, rowIndex }) => {
    const tileRef = useRef();

    useEffect(() => {
        tileRef.current.classList.remove("tile-available-move");
        const validClaims = findAllValidClaims(gameState);
        if (validClaims.length > 0) {
            for (let [claimIndex, claim] of validClaims.entries()) {
                if (
                    claim.row === Number(tileRef.current.dataset.row) &&
                    claim.col === Number(tileRef.current.dataset.col)
                ) {
                    tileRef.current.classList.add("tile-available-move");
                }
            }
        } else {
            const validMoves = findAllValidMoves(gameState);
            if (validMoves.length > 0) {
                for (let [claimIndex, claim] of validMoves.entries()) {
                    if (
                        claim.row === Number(tileRef.current.dataset.row) &&
                        claim.col === Number(tileRef.current.dataset.col)
                    ) {
                        tileRef.current.classList.add("tile-available-move");
                    }
                }
            }
        }
    });

    return (
        <div
            ref={tileRef}
            className={`tile ${ (cellIndex + rowIndex) % 2 ? 'black-tile' : ''}`}
            data-index={cellIndex + rowIndex * gameState.board.length}
            data-row={rowIndex}
            data-col={cellIndex}
        >
            {cell.piece && (
                <Piece cell={cell} gameState={gameState} draggedEl={draggedEl} />
            )}
        </div>
    );
});

export default Tile;
