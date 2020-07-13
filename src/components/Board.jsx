import React from "react";
import Square from "./Square";

const szSquare = (Math.min(window.innerWidth, window.innerHeight) - 150) / 15;
export default function Board(props) {
    const { dim, board, onClick } = props;

    return (
        <div
            style={{
                display: "grid",
                borderRight: "none",
                margin: "0 auto",
                gridTemplate: `repeat(${dim}, ${szSquare}fr) / repeat(${dim}, ${szSquare}fr)`,
                textAlign: "center",
            }}
        >
            {board.map((row, i) =>
                row.map((col, j) => (
                    <Square
                        szSquare={szSquare}
                        key={i * dim + j}
                        lastMove={col.lastMove}
                        value={col.value}
                        onClick={() => onClick(i * dim + j)}
                    />
                ))
            )}
        </div>
    );
}
