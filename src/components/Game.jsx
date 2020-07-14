import React, { useState } from "react";
import { useWorker } from "@koale/useworker";
import Board from "./Board";
import findWinner from "../helpers/findWinner";
import ai_move from "../helpers/aiAssist";
import "./Game.css";

const boardDimension = 15;
const ai = -1,
    player = 1;
let aiThinking = false;

export default function Game() {
    const [history, setHistory] = useState([
        Array(boardDimension)
            .fill(null)
            .map(() =>
                Array(boardDimension)
                    .fill(null)
                    .map(() => ({ lastMove: false, value: 0 }))
            ),
    ]);
    const [step, setStep] = useState(0);
    const [board, setBoard] = useState(
        Array(boardDimension)
            .fill(null)
            .map(() =>
                Array(boardDimension)
                    .fill(null)
                    .map(() => ({ lastMove: false, value: 0 }))
            )
    );
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [winner, _] = findWinner(
        board.map((row) => row.map((col) => col.value)),
        boardDimension,
        ai,
        player
    );

    const [aiWorker] = useWorker(ai_move); // Web Worker
    const aiTurn = async (b) => {
        try {
            const [x, y] = await aiWorker(
                b.map((row) => row.map((col) => col.value)),
                boardDimension,
                ai,
                player
            );
            b = b.map((row) =>
                row.map((col) => ({ lastMove: false, value: col.value }))
            );
            b[x][y].lastMove = true;
            b[x][y].value = ai;
            setIsPlayerTurn(!isPlayerTurn);
    
            let t = handleWinner(b);
            setBoard(b);
            setHistory([...history.splice(0, step + 1), t[0]]);
            setStep(step + 1);
        } catch (e)
        {
            console.log(e);
        }
        
    };

    if (aiThinking) {
        if (!winner) {
            aiTurn(board);
            aiThinking = false;
        }
    }

    const handleWinner = (b) => {
        const [newWinner, newLine] = findWinner(
            b.map((row) => row.map((col) => col.value)),
            boardDimension,
            ai,
            player
        );
        if (newWinner) {
            b = b.map((row) =>
                row.map((col) => ({ lastMove: false, value: col.value }))
            );
            for (let [x, y] of newLine) b[x][y].lastMove = true;
        }

        return [b, newWinner];
    };
    const handleClick = (id) => {
        let b = board.map((row) =>
            row.map((col) => ({ lastMove: false, value: col.value }))
        );
        const i = Math.floor(id / boardDimension);
        const j = Math.floor(id % boardDimension);

        if (!isPlayerTurn || b[i][j].value || winner) return;

        b[i][j].lastMove = true;
        b[i][j].value = isPlayerTurn ? player : ai;

        let t = handleWinner(b);
        if (!t[1]) {
            setIsPlayerTurn(!isPlayerTurn);
            aiThinking = true;
        } else aiThinking = false;
        setBoard(t[0]);
        setHistory([...history.splice(0, step + 1), t[0]]);
        setStep(step + 1);
    };

    const handleRestart = () => {
        setBoard(
            Array(boardDimension)
                .fill(null)
                .map(() =>
                    Array(boardDimension)
                        .fill(null)
                        .map(() => ({ lastMove: false, value: 0 }))
                )
        );
        setIsPlayerTurn(true);
        setHistory([
            Array(boardDimension)
                .fill(null)
                .map(() =>
                    Array(boardDimension)
                        .fill(null)
                        .map(() => ({ lastMove: false, value: 0 }))
                ),
        ]);
        setStep(0);
    };

    const handlePrevious = () => {
        if (step === 0) return;
        setBoard(history[step % 2 === 0 ? step - 2 : step - 1]);
        setStep(step % 2 === 0 ? step - 2 : step - 1);
    };

    const handleNext = () => {
        if (step === history.length - 1) return;
        setBoard(history[step + 2 === history.length ? step + 1 : step + 2]);
        setStep(step + 2 === history.length ? step + 1 : step + 2);
    };

    return (
        <div className="game">
            <div className="board">
                <Board
                    dim={boardDimension}
                    board={board}
                    onClick={handleClick}
                />
            </div>
            <div className="navigation-container-transparent">
                <div className="navigation-container-visible">
                    <div className="buttons-container">
                        <button
                            disabled={!isPlayerTurn}
                            className="restart"
                            onClick={handleRestart}
                        >
                            RESTART
                        </button>

                        <div className="move-navigations-container">
                            <button
                                disabled={
                                    (!isPlayerTurn && !winner) || step === 0
                                }
                                className="move-navigation"
                                onClick={handlePrevious}
                            >
                                Previous Move
                            </button>
                            <button
                                disabled={
                                    (!isPlayerTurn && winner) ||
                                    step === history.length - 1
                                }
                                className="move-navigation"
                                onClick={handleNext}
                            >
                                Next Move
                            </button>
                        </div>
                    </div>

                    <div className="log-container">
                        {!winner && isPlayerTurn && <h1>It's your turn 😎</h1>}
                        {!winner && !isPlayerTurn && <h1>AI is thinking 🤔</h1>}
                        {winner && (
                            <h1>{winner === 1 ? "You won 🥳" : "AI won 😭"}</h1>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
