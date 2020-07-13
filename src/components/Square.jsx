import React, { useState } from "react";

export default function Square(props) {
    const { lastMove, value, onClick, szSquare } = props;

    const [isMouseOn, setIsMouseOn] = useState(false);
    const styles = {
        backgroundColor: isMouseOn ? "rgb(253, 245, 230, 75%)" : lastMove ? 'rgb(153, 255, 153)' : "transparent",
        border: "0.5px solid lightgrey",
        height: '5vh',
        width: '5vh', 
        fontSize: '4vh',
        fontWeight: "bold",
        outline: "none",
        color: value === 1 ? "#DC143C" : "#FFA500",
        textAlign: 'center'
    };

    const handleMouseEnter = () => {
        setIsMouseOn(true);
    };

    const handleMouseLeave = () => {
        setIsMouseOn(false);
    };

    return (
        <div>
            <div
                style={styles}
                onClick={onClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {value === 1 ? "X" : value === -1 ? "O" : ""}
            </div>
        </div>
    );
}
