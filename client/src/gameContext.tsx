import React from "react";
import { Socket } from "socket.io-client";

export interface IGameContextProp {
    isInRoom: boolean;
    setIsInRoom: (inRoom: boolean) => void;
    gameStarted: boolean;
    setGameStarted: (started: boolean) => void;
    isReady: boolean;
    setIsReady: (started: boolean) => void;

    roomState: string;
    setRoomState: (state: string) => void;
};

const defaultState: IGameContextProp = {
    isInRoom: false,
    setIsInRoom: () => {console.log("Default isInRoom setting called")},
    gameStarted: false,
    setGameStarted: () => {console.log("Default gameStarted setting called")},
    isReady: false,
    setIsReady: () => {console.log("Default isReady setting called")},

    roomState: "",
    setRoomState: () => {console.log("Default setRoomState setting called")}
};

export default React.createContext(defaultState);