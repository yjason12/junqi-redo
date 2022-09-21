import { Side } from "./IJunqiGame";
import { Schema } from "mongoose";

export interface IPiece {
    rank: Rank;
    player: Side;

    determineWinner(other: IPiece): IPiece | null;
}

export enum Rank{
    Empty = -1,
    Flag=0,
    Engineer=1,
    Lieutenant=2,
    Captain=3,
    Major=4,
    Colonel=5,
    BrigadierGeneral=6,
    MajorGeneral=7,
    General=8,
    FieldMarshal = 9,
    Landmine=10,
    Bomb=11
}

export const IPieceSchema : Schema = new Schema({
    rank : { type : Number, required : true },
    player : { type : Number, required : true }
});