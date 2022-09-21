import React, { useContext, useEffect } from "react";
import styled from "styled-components"
import gameContext from "../../gameContext";
import gameService from "../../services/gameService";
import socketService from "../../services/socketService";
import Board from "./Board";
import boardProps from "./Board";

const ReadyButton = styled.button`
  margin-top: 2em;
  width: 20vw;
  height: 8vh;
`;
const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
`;

export interface IReadyUp {
    state: boolean
}

export interface IGameState {
    state: string
}

export default function Game() {
    const { isInRoom, setIsInRoom,
        gameStarted, setGameStarted,
        isReady, setIsReady,
        roomState, setRoomState } = useContext(gameContext);

    const readyUp = () => {
        if (socketService.socket) {
            setIsReady(true); // this sets the ready to the presumed state and will actually update once the ready_response is heard back
            gameService.onReadyUp(socketService.socket, (val: IReadyUp) => {
                setIsReady(val["state"]);
            });
        }
    }

    useEffect(() => {
        if (socketService.socket) {
            gameService.onRoomStateChange(socketService.socket, (val: IGameState) => {
                if (val["state"] == "play") {
                    setRoomState("play")
                }
            });
        }
    }, []);


    let pos: [number, number] = [0,0];

    let tempTiles = [{
                    position : pos, 
                    rank: 9,
                    side: "blue"
                    }
                    ]

    return <GameContainer>
        {roomState != "play" && gameStarted ? <ReadyButton onClick={readyUp}>{isReady ? "Unready" : "Ready"}</ReadyButton> : <div>waiting for second player</div>}
        {roomState == "play" &&

        <div>
            <Board tiles = {tempTiles} />
        </div>
        }
    </GameContainer>
}
