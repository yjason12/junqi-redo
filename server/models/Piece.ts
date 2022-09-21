import { Side } from "./interfaces/IJunqiGame";
import { IPiece, Rank } from "./interfaces/IPiece";

export class Piece implements IPiece {
    constructor(r: Rank, p: Side){
        this.rank = r;
        this.player= p;
    }

    rank: Rank;
    player: Side;

    determineWinner(other: IPiece): IPiece | null {
        if(this.rank == other.rank) return null;
        return this.rank > other.rank ? this : other;
    }
}



