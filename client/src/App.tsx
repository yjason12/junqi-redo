import React, { useEffect, useState } from "react";
import "./App.css";
import styled from "styled-components";
import TitlePage from "./components/TitlePage";
import socketService from "./services/socketService";
import GameContext, { IGameContextProp } from "./gameContext";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Homepage from "./components/Homepage";
import LobbyPage from "./components/LobbyPage";
import Board from "./components/Game/Board";

function App() {
  const [isInRoom, setIsInRoom] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [roomState, setRoomState] = useState("");

  const gameContextValue: IGameContextProp = {
    isInRoom,
    setIsInRoom,
    gameStarted,
    setGameStarted,
    isReady,
    setIsReady,
    roomState,
    setRoomState
  };

  let pos: [number, number] = [0,0];
    
  let tempTiles = [{
                  position : pos, 
                  rank: 9,
                  side: "blue"
                  }]
  return (

    <GameContext.Provider value={gameContextValue}>
    <Router>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='room/*' element={<LobbyPage/>}/>
        <Route path='board' element={<Board tiles = {tempTiles} />}/>
      </Routes>
    </Router>


    </GameContext.Provider>

  );
}

export default App;
