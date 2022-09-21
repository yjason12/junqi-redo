import { IJunqiGame, Side } from "./interfaces/IJunqiGame";
import { IBoard } from "./interfaces/IBoard";
import { JunqiBoard } from "./JunqiBoard";
import { Position } from "./Position";

export class JunqiGame implements IJunqiGame {
    name: string;
    board: IBoard;
    turn: number;
    started: boolean;
    players: string[];
    ready: Map<string, boolean>;
    
    static fromGame(game : IJunqiGame): JunqiGame {
        var jq = new this(new JunqiBoard(""));
        jq.name = game.name;
        jq.board = game.board;
        jq.turn = game.turn
        jq.started = game.started
        jq.players = game.players;
        jq.ready = game.ready;
        return jq;
    }
    
    constructor(board: IBoard){
        this.name = "";
        this.board = board;
        this.turn = 0;
        this.started = false;
        this.players = [];
        this.ready = new Map([]);
    }

    makeMove(pos1: Position, pos2: Position): boolean {
        throw new Error("Method not implemented.");
    }

    swap(pos1: Position, pos2: Position): boolean {
        throw new Error("Method not implemented.");
    }

    surrender(s: Side): void {
        throw new Error("Method not implemented.");
    }

    readyUp(s: Side): void {
        throw new Error("Method not implemented.");
    }
}
