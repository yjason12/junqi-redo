import React, { useState } from 'react'
import styled from 'styled-components';
import TitlePage from './TitlePage'
import GameContext, { IGameContextProp } from "../gameContext";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
`;


export default function Homepage() {

  return (
      <AppContainer>
        <TitlePage></TitlePage>
      </AppContainer>
  )
}
