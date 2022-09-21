import React from 'react'

import "./Board.css";
import Tile from './Tile';



export interface BoardProps{
  tiles: {
          position: [number, number];
          rank: number;
          side: string;
          }[]
}
// interface BoardProps {
//   tiles: any
// }

export default function Board({tiles} : BoardProps) {
  let board = getEmptyBoard();

  for(let i = 0; i < tiles.length; i++){
    let currTile = tiles[i];
    let pieceRank = currTile.rank;
    let side = currTile.side;
    let r = currTile.position[0];
    let c = currTile.position[1];

    let boardIndex = (5 * r) + c;

    board[boardIndex] = (<Tile piece = {pieceRank} side = {side} r = {r} c = {c} />);
  }

  return (
    <div id = "board">{board}</div>
  )
}

function getEmptyBoard(){
  let board = [];
  for(let i = 0; i < 12; i++){
    for(let j = 0; j < 5; j++){

      board.push(<Tile piece = {-2} side = {"neither"} r = {i} c= {j} />);

    }
  }
  return board;
}
