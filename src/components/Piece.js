import React from "react";

import {
    handlePieceMouseLeave,
    handlePieceMouseOver
} from "../helpers/moveUtils";

const Piece = ({ gameState, draggedEl, cell }) => {
    const handleMouseOver = e => handlePieceMouseOver(e.target.parentNode, gameState)
    const handleMouseLeave = e => draggedEl !== e.target && handlePieceMouseLeave(e);

    return (
        <div
            className={`piece ${cell.player || ''}`}
            onMouseEnter={handleMouseOver}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseLeave}
            onMouseLeave={handleMouseLeave}
        />
    );
};

export default Piece;
