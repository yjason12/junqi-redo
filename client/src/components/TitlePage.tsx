import React, { useState, useEffect, useContext } from "react";
import socketService from "../services/socketService";
import styled from "styled-components";
import gameService from "../services/gameService";
import gameContext from "../gameContext";

const TitleScreenContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2em;
`;

const Title = styled.div`
  font-size: 3em;
  text-align: center;
`;

const PlayButton = styled.button`
  margin-top: 2em;
  width: 20vw;
  height: 8vh;
`;

const RoomIDInput = styled.input`
  margin-top: 5em;
  width: 20vw;
  height: 8vh;
`;


//stuff for main webpage
interface ITitleProps {}



export default function TitlePage(props: ITitleProps) {
  //user inputted roomid
  const [roomID, setRoomID] = useState("");

  //update roomID var as user modifies textbox
  const handleRoomIDChange = (e: React.ChangeEvent<any>) => {
    setRoomID(e.target.value);
  };

  //send user to room
  const redirectToRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(roomID);
    window.open(`${window.location.origin}/room/${roomID}`, "_self");
  };

  return (
    <form>
      <TitleScreenContainer>
        <Title>Junqi</Title>
        <RoomIDInput
          placeholder="Room ID"
          value={roomID}
          onChange={handleRoomIDChange}
        ></RoomIDInput>
        <PlayButton onClick={redirectToRoom}>Join Room</PlayButton>
      </TitleScreenContainer>
    </form>
  );
}
