import { IPiece } from "./IPiece";
import { ITile, ITileSchema } from "./ITile";
import { Position } from "../Position";
import { Schema } from "mongoose";
import { Side } from "./IJunqiGame";

export interface IBoard{
    board: ITile[][];
    winner: Side;
    revealedFlags: Map<Side, boolean>

    setPieceAt(pos: Position, piece: IPiece): void;
    getPieceAt(pos: Position): IPiece;

    isLegalMove(pos1: Position, pos2: Position): boolean;
    makeMove(pos1: Position, pos2: Position): boolean;

    isLegalSwap(pos1: Position, pos2: Position): boolean;
    swap(pos1: Position, pos2: Position): boolean;

    hasPiece(pos1: Position): boolean;
    hasWinner(): Side;
    getRevealedFlags(): Map<Side, boolean>;

    // im not sure if this is really good
    // maybe make this a Side, but then DBController needs to know about sides
    // idk which is better to have (actually leaning towards the other one)
    toClientJSON(side: string): string;
}

export const IBoardSchema : Schema = new Schema({
    board: { type: [[ITileSchema]], required : true}
})
