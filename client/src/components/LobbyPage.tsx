import React, { useContext, useEffect, useState } from "react";
import gameContext from "../gameContext";
import gameService from "../services/gameService";
import socketService from "../services/socketService";
import Game from "./Game/Game";

export interface IStartGame {
    start: boolean;
    startingPlayer: string;
}

export default function LobbyPage() {
    const { isInRoom, setIsInRoom, gameStarted, setGameStarted } = useContext(gameContext);
    const [isJoining, setIsJoining] = useState(false);

    const connectSocket = async () => {
        if (!process.env.REACT_APP_SERVER_URL) {
            console.warn("Could not find server url in config");
            return;
        }
        console.log("attempting connection");
        const socket = await socketService
            .connect(process.env.REACT_APP_SERVER_URL)
            .catch((err) => {
                console.log("Error: ", err);
            });
    };

    useEffect(() => {
        connectSocket().finally(() => {
            const to_join_id = window.location.pathname.split("/").pop();
            if (to_join_id) {
                joinRoom(to_join_id);
            } else {
                console.log("Failed to join room: invalid path");
                window.open(`${window.location.origin}`, "_self");
            }
        });
        handleGameStart();
    }, []);

    const joinRoom = async (roomID: string) => {
        if (isJoining) {
            console.log(
                "Cannot join room while awaiting server response for previous join request!"
            );
            return;
        }
        setIsJoining(true);
        const socket = socketService.socket;
        if (!roomID || roomID.trim() === "") {
            console.warn("Failed to join room: Invalid room ID");
            setIsJoining(false);
            window.open(`${window.location.origin}`, "_self");
            return;
        }

        if (!socket) {
            console.log("Failed to join room: Socket does not exist");
            setIsJoining(false);
            window.open(`${window.location.origin}`, "_self");
            return;
        }

        const joined = await gameService
            .joinGameRoom(socket, roomID)
            .catch((err) => {
                console.warn("Failed to join room: ", err);
                window.open(`${window.location.origin}`, "_self");
            });

        if (joined) {
            setIsInRoom(true);
        }
        setIsJoining(false);
    };

    const handleGameStart = () => {
        if (socketService.socket) {
            gameService.onStartGame(socketService.socket, (options: IStartGame) => {
                setGameStarted(options["start"]);
            });
        }
    };

    return (
        <>
            {isInRoom &&
                <Game></Game>
            }
        </>
    );
}
