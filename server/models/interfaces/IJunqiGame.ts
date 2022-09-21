import { Piece } from "../Piece";
import { Position } from "../Position";
import { IBoard, IBoardSchema } from "./IBoard";
import mongoose, { Document, Schema } from "mongoose";

export interface IJunqiGame{
    name: string;
    board: IBoard;
    turn: number;
    started: boolean;
    players: string[];
    ready: Map<string, boolean>;

    // makeMove will return true or false depending on whether or not the was successfully made
    makeMove(pos1: Position, pos2: Position): boolean;
    swap(pos1: Position, pos2: Position): boolean;
    surrender(s: Side) : void;
    readyUp(s: Side): void;
}

export interface IJunqiGameModel extends IJunqiGame, Document {}

export const IJunqiGameSchema : Schema = new Schema({
    name: { type : String, required : true},
    board: { type : IBoardSchema, required : true},
    turn: { type : Number, required: true},
    started : { type : Boolean, required : true},
    players: { type: [String], required : true },
    ready : { type : Map, required : true }
});

export default mongoose.model<IJunqiGameModel>('JunqiGame', IJunqiGameSchema);

export enum Side {
    Neither,
    Blue,
    Red
};
