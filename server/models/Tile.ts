import { ITile } from "./interfaces/ITile";
import { IPiece} from "./interfaces/IPiece"

export class Tile implements ITile {
    piece: IPiece;
    tileType: TileType;

    railroadNeighbors: ITile[];
    roadNeighbors: ITile[];
    
    constructor(piece: IPiece, tileType: TileType){
        this.piece = piece;
        this.tileType = tileType;
        this.railroadNeighbors = [];
        this.roadNeighbors = [];
    }
    hasPiece(): boolean {
        return this.getPiece().rank !== -1;
    }
    getRoadNeighbors(): ITile [] {
        return this.roadNeighbors;
    }
    getRailroadNeighbors(): ITile [] {
        return this.railroadNeighbors;
    }

    setPiece(piece: IPiece): void {
        this.piece = piece;
    }

    getTileType(): TileType {
        return this.tileType;
    }

    getPiece(): IPiece {
        return this.piece;
    }

    setRailroadNeighbors(neighbors: ITile[]): void{
        this.railroadNeighbors = neighbors;
    }

    setRoadNeighbors(neighbors: ITile[]): void{
        this.roadNeighbors = neighbors;
    }

    setNeighbors(n1: ITile[], n2: ITile[]){
        this.roadNeighbors = n1;
        this.railroadNeighbors = n2;
    }
    
}

export enum TileType{
    Post = 1,
    Campsite=2,
    HQ=3
}