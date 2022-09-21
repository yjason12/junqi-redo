import { TileType } from "../Tile";
import { IPiece, IPieceSchema } from "./IPiece";
import { Schema } from "mongoose";

export interface ITile {
    piece: IPiece;
    tileType: TileType;
    setPiece(piece: IPiece): void;
    getPiece(): IPiece;
    hasPiece(): boolean;
    getRoadNeighbors(): ITile [];
    getRailroadNeighbors(): ITile [];
    
    setRoadNeighbors(neighbors: ITile[]): void;
    setRailroadNeighbors(neighbors: ITile[]): void;
    setNeighbors(n1: ITile[],neighbors: ITile[]): void;

    getTileType(): TileType;
}

export const ITileSchema : Schema = new Schema({
    piece: { type: IPieceSchema, required: true },
    tileType: { type: Number, required: true, immutable: true }
})