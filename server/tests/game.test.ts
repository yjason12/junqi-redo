import { Side } from "../models/interfaces/IJunqiGame";
import { Rank } from "../models/interfaces/IPiece";
import { JunqiBoard } from "../models/JunqiBoard";
import { Piece } from "../models/Piece";
import { Position } from "../models/Position";
import { Tile, TileType } from "../models/Tile";

describe('board', () => {
    it('can be initalized without error', () => {
        new JunqiBoard();
    });

    // TODO: make a beforeAll thing to initalize testboard instead

    it('initally has pieces in the correct places', () => {
        const testBoard = new JunqiBoard();
        expect(testBoard.getPieceAt(new Position(1, 1))).toStrictEqual(new Piece(Rank.Landmine, Side.Red));
        expect(testBoard.getPieceAt(new Position(3, 4))).toStrictEqual(new Piece(Rank.Lieutenant, Side.Red));
        expect(testBoard.getPieceAt(new Position(9, 2))).toStrictEqual(new Piece(Rank.Lieutenant, Side.Blue));
    })

    it('has same number of pieces on both sides', () => {
        const testBoard = new JunqiBoard();
        let redCount = 0;
        let blueCount = 0;
        let emptyCount = 0;
        for(let i = 0; i < testBoard.board.length; i++) {
            for(let j = 0; j <testBoard.board[i].length; j++) {
                if(testBoard.getPieceAt(new Position(i, j)).player == Side.Blue) blueCount++;
                else if(testBoard.getPieceAt(new Position(i, j)).player == Side.Red) redCount++;
                else emptyCount++;
            }
        }

        expect(emptyCount).toBe(10);
        expect(redCount).toBe(25);
        expect(blueCount).toBe(25);
    })

    it("throws error on invalid getPieceAt position", () => {
        const testBoard = new JunqiBoard();
        expect(() => {testBoard.getPieceAt(new Position(-1, -1))}).toThrowError("Position given is not on board!")
        expect(() => {testBoard.getPieceAt(new Position(-1, 5))}).toThrowError("Position given is not on board!")
        expect(() => {testBoard.getPieceAt(new Position(2, -1))}).toThrowError("Position given is not on board!")
        expect(() => {testBoard.getPieceAt(new Position(29, 2))}).toThrowError("Position given is not on board!")
    }) 

    it("throws error on invalid setPieceAt position", () => {
        const testBoard = new JunqiBoard();
        expect(() => {testBoard.setPieceAt(new Position(-1, -1), new Piece(Rank.Bomb, Side.Blue))}).toThrowError("Position given is not on board!");
        expect(() => {testBoard.setPieceAt(new Position(-5, 4), new Piece(Rank.Bomb, Side.Blue))}).toThrowError("Position given is not on board!");
        expect(() => {testBoard.setPieceAt(new Position(24, 502), new Piece(Rank.Bomb, Side.Blue))}).toThrowError("Position given is not on board!");
        expect(() => {testBoard.setPieceAt(new Position(2, -1), new Piece(Rank.Bomb, Side.Blue))}).toThrowError("Position given is not on board!");
    })

    it("correctly sets and gets pieces", () => {
        const testBoard = new JunqiBoard();
        expect(testBoard.getPieceAt(new Position(3, 4))).toStrictEqual(new Piece(Rank.Lieutenant, Side.Red));
        testBoard.setPieceAt(new Position(3, 4), new Piece(Rank.Bomb, Side.Red));
        expect(testBoard.getPieceAt(new Position(3, 4))).toStrictEqual(new Piece(Rank.Bomb, Side.Red));
    })

    it("cannot swap opposing side pieces", () => {
        const testBoard = new JunqiBoard();
        expect(testBoard.getPieceAt(new Position(3, 4))).toStrictEqual(new Piece(Rank.Lieutenant, Side.Red));
        expect(testBoard.getPieceAt(new Position(6, 4))).toStrictEqual(new Piece(Rank.Captain, Side.Blue));
        expect(testBoard.isLegalSwap(new Position(3, 4), new Position(6, 4))).toBe(false);
        expect(testBoard.isLegalSwap(new Position(6, 4), new Position(3, 4))).toBe(false);
        expect(testBoard.isLegalSwap(new Position(1, 1), new Position(6, 4))).toBe(false);
        expect(testBoard.getPieceAt(new Position(1, 0))).toStrictEqual(new Piece(Rank.Engineer, Side.Red));
        expect(testBoard.getPieceAt(new Position(10, 4))).toStrictEqual(new Piece(Rank.Engineer, Side.Blue));
        expect(testBoard.isLegalSwap(new Position(1, 0), new Position(10, 4))).toBe(false);
    });

    it("cannot swap landmines past second row", () => {
        const testBoard = new JunqiBoard();
        expect(testBoard.getPieceAt(new Position(3, 4))).toStrictEqual(new Piece(Rank.Lieutenant, Side.Red));
        expect(testBoard.getPieceAt(new Position(1, 1))).toStrictEqual(new Piece(Rank.Landmine, Side.Red));
        expect(testBoard.getPieceAt(new Position(10, 1))).toStrictEqual(new Piece(Rank.Landmine, Side.Blue));
        expect(testBoard.isLegalSwap(new Position(3, 4), new Position(1, 1))).toBe(false);
        expect(testBoard.isLegalSwap(new Position(3, 4), new Position(1, 1))).toBe(false);
        expect(testBoard.isLegalSwap(new Position(10, 1), new Position(8, 0))).toBe(false);
        expect(testBoard.isLegalSwap(new Position(10, 1), new Position(1, 2))).toBe(false);
    })

    it("can swap landmines in the first or second row", () => {
        const testBoard = new JunqiBoard();
        expect(testBoard.getPieceAt(new Position(10, 0))).toStrictEqual(new Piece(Rank.Engineer, Side.Blue));
        expect(testBoard.getPieceAt(new Position(10, 1))).toStrictEqual(new Piece(Rank.Landmine, Side.Blue));
        expect(testBoard.getPieceAt(new Position(10, 2))).toStrictEqual(new Piece(Rank.Landmine, Side.Blue));
        expect(testBoard.isLegalSwap(new Position(10, 1), new Position(10, 0))).toBe(true);
        expect(testBoard.isLegalSwap(new Position(10, 1), new Position(10, 2))).toBe(true);
        expect(testBoard.isLegalSwap(new Position(10, 2), new Position(10, 1))).toBe(true);
        expect(testBoard.isLegalSwap(new Position(10, 1), new Position(11, 0))).toBe(true);

        expect(testBoard.getPieceAt(new Position(1, 1))).toStrictEqual(new Piece(Rank.Landmine, Side.Red));
        expect(testBoard.getPieceAt(new Position(1, 2))).toStrictEqual(new Piece(Rank.Landmine, Side.Red));
        expect(testBoard.isLegalSwap(new Position(1, 1), new Position(1, 0))).toBe(true);
        expect(testBoard.isLegalSwap(new Position(1, 1), new Position(1, 2))).toBe(true);
        expect(testBoard.isLegalSwap(new Position(1, 2), new Position(0, 0))).toBe(true);
    })

    it("cannot swap flag out of HQ", () => {
        const testBoard = new JunqiBoard();
        expect(testBoard.getPieceAt(new Position(11, 1))).toStrictEqual(new Piece(Rank.Flag, Side.Blue));
        expect(testBoard.isLegalSwap(new Position(11, 2), new Position(11, 1))).toBe(false);
        expect(testBoard.isLegalSwap(new Position(11, 2), new Position(3, 4))).toBe(false);
        expect(testBoard.getPieceAt(new Position(0, 1))).toStrictEqual(new Piece(Rank.Flag, Side.Red));
        expect(testBoard.isLegalSwap(new Position(0, 1), new Position(3, 4))).toBe(false);
        expect(testBoard.isLegalSwap(new Position(3, 4), new Position(0, 1))).toBe(false);
        expect(testBoard.isLegalSwap(new Position(0, 0), new Position(0, 1))).toBe(false);
        expect(testBoard.isLegalSwap(new Position(0, 1), new Position(0, 0))).toBe(false);
    });

    it("can swap pieces", () => {
        const testBoard = new JunqiBoard();

        expect(testBoard.isLegalSwap(new Position(6, 0), new Position(6, 1))).toBe(true);
        testBoard.swap(new Position(6, 0), new Position(6, 1));
        expect(testBoard.getPieceAt(new Position(6, 0))).toStrictEqual(new Piece(Rank.General, Side.Blue));
        expect(testBoard.getPieceAt(new Position(6, 1))).toStrictEqual(new Piece(Rank.Captain, Side.Blue));

        expect(testBoard.isLegalSwap(new Position(6, 0), new Position(6, 2))).toBe(true);
        testBoard.swap(new Position(6, 0), new Position(6, 2));
        expect(testBoard.getPieceAt(new Position(6, 0))).toStrictEqual(new Piece(Rank.Captain, Side.Blue));
        expect(testBoard.getPieceAt(new Position(6, 2))).toStrictEqual(new Piece(Rank.General, Side.Blue));

        expect(testBoard.isLegalSwap(new Position(6, 0), new Position(8, 4))).toBe(true);
        testBoard.swap(new Position(6, 0), new Position(8, 4));
        expect(testBoard.getPieceAt(new Position(6, 0))).toStrictEqual(new Piece(Rank.Lieutenant, Side.Blue));
        expect(testBoard.getPieceAt(new Position(8, 4))).toStrictEqual(new Piece(Rank.Captain, Side.Blue));

        expect(testBoard.isLegalSwap(new Position(10, 1), new Position(10, 0))).toBe(true);
        testBoard.swap(new Position(10, 1), new Position(10, 0));
        expect(testBoard.getPieceAt(new Position(10, 1))).toStrictEqual(new Piece(Rank.Engineer, Side.Blue));
        expect(testBoard.getPieceAt(new Position(10, 0))).toStrictEqual(new Piece(Rank.Landmine, Side.Blue));

        expect(testBoard.isLegalSwap(new Position(11, 3), new Position(9, 0))).toBe(true);
        testBoard.swap(new Position(11, 3), new Position(9, 0));
        expect(testBoard.getPieceAt(new Position(11, 3))).toStrictEqual(new Piece(Rank.Major, Side.Blue));
        expect(testBoard.getPieceAt(new Position(9, 0))).toStrictEqual(new Piece(Rank.Bomb, Side.Blue));

        expect(testBoard.isLegalSwap(new Position(9, 0), new Position(11, 3))).toBe(true);
        testBoard.swap(new Position(9, 0), new Position(11, 3));
        expect(testBoard.getPieceAt(new Position(11, 3))).toStrictEqual(new Piece(Rank.Bomb, Side.Blue));
        expect(testBoard.getPieceAt(new Position(9, 0))).toStrictEqual(new Piece(Rank.Major, Side.Blue));

        expect(testBoard.isLegalSwap(new Position(11, 3), new Position(11, 4))).toBe(true);
        testBoard.swap(new Position(11, 3), new Position(11, 4));
        expect(testBoard.getPieceAt(new Position(11, 3))).toStrictEqual(new Piece(Rank.Major, Side.Blue));
        expect(testBoard.getPieceAt(new Position(11, 4))).toStrictEqual(new Piece(Rank.Bomb, Side.Blue));

        expect(testBoard.isLegalSwap(new Position(11, 3), new Position(10, 4))).toBe(true);
        testBoard.swap(new Position(11, 3), new Position(10, 4));
        expect(testBoard.getPieceAt(new Position(11, 3))).toStrictEqual(new Piece(Rank.Engineer, Side.Blue));
        expect(testBoard.getPieceAt(new Position(10, 4))).toStrictEqual(new Piece(Rank.Major, Side.Blue));
    })

    it("correctly determines engineer moves", ()=>{
        const testBoard = new JunqiBoard("????? ?1??? 2222? ?222? ????? ????? ??3?? ????? ????? ????? ????? ?????");
        expect(testBoard.isLegalMove(new Position(1,1), new Position(6,2))).toBe(true);
        const testBoard2 = new JunqiBoard("????? ?1??? 22222 ?222? ????? ????? ??3?? ????? ????? ????? ????? ?????");
        expect(testBoard2.isLegalMove(new Position(1,1), new Position(6,2))).toBe(false);
        const testBoard3 = new JunqiBoard("????? ??2?? ??1?? ?222? ????? ????? ??3?? ????? ????? ????? ????? ?????");
        testBoard3.setPieceAt(new Position(1,2), new Piece(Rank.Colonel, Side.Blue));
        expect(testBoard3.isLegalMove(new Position(2,2), new Position(1,2))).toBe(true);


    })

    it("non engineer railroad paths work", ()=>{
        const testBoard = new JunqiBoard("????? ????? ????? ????? ????? ????? ????? ????? ????? ????? ????? ?????");
        testBoard.setPieceAt(new Position(1,0), new Piece(Rank.Colonel, Side.Red));
        testBoard.setPieceAt(new Position(7,0), new Piece(Rank.Colonel, Side.Blue));
        expect(testBoard.isLegalMove(new Position(1,0), new Position(7,0))).toBe(true);
        testBoard.setPieceAt(new Position(5,0), new Piece(Rank.Colonel, Side.Blue));
        expect(testBoard.isLegalMove(new Position(1,0), new Position(5,0))).toBe(true);
        expect(testBoard.isLegalMove(new Position(1,0), new Position(7,0))).toBe(false);
        testBoard.setPieceAt(new Position(5,2), new Piece(Rank.Colonel, Side.Red));
        testBoard.setPieceAt(new Position(6,2), new Piece(Rank.Colonel, Side.Blue));
        expect(testBoard.isLegalMove(new Position(5,2), new Position(6,2))).toBe(true);

        const testBoard2 = new JunqiBoard("????? ????? ????? ????? ????? ????? ????? ????? ????? ????? ????? ?????");
        testBoard2.setPieceAt(new Position(1,0), new Piece(Rank.Colonel, Side.Red));
        expect(testBoard2.makeMove(new Position(1,0), new Position(10,0))).toBe(true);
        expect(testBoard2.makeMove(new Position(10,0), new Position(10,4))).toBe(true);
        expect(testBoard2.makeMove(new Position(10,4), new Position(1,4))).toBe(true);
        expect(testBoard2.makeMove(new Position(1,4), new Position(1,0))).toBe(true);

        testBoard2.setPieceAt(new Position(5,0), new Piece(Rank.Colonel, Side.Red));
        testBoard2.setPieceAt(new Position(6,0), new Piece(Rank.Colonel, Side.Red));

        expect(testBoard2.makeMove(new Position(5,0), new Position(5,4))).toBe(true);
        expect(testBoard2.makeMove(new Position(5,4), new Position(5,0))).toBe(true);
        expect(testBoard2.makeMove(new Position(6,0), new Position(6,4))).toBe(true);
        expect(testBoard2.makeMove(new Position(6,4), new Position(6,0))).toBe(true);

        testBoard2.setPieceAt(new Position(5,2), new Piece(Rank.Colonel, Side.Red));
        testBoard2.setPieceAt(new Position(6,2), new Piece(Rank.Colonel, Side.Red));

        expect(testBoard2.makeMove(new Position(5,0), new Position(5,4))).toBe(false);
        expect(testBoard2.makeMove(new Position(6,4), new Position(6,0))).toBe(false);


    })

    it("general move cases", ()=>{
        const testBoard = new JunqiBoard("????? ????? ????? ????? ????? ????? ????? ????? ????? ????? ????? ?????");
        testBoard.setPieceAt(new Position(0,0), new Piece(Rank.Colonel, Side.Blue));
        testBoard.setPieceAt(new Position(1,0), new Piece(Rank.Colonel, Side.Red));
        expect(testBoard.isLegalMove(new Position(0,0), new Position(1,0))).toBe(true);
        testBoard.setPieceAt(new Position(7,0), new Piece(Rank.Colonel, Side.Blue));
        testBoard.setPieceAt(new Position(5,0), new Piece(Rank.Colonel, Side.Blue));
        expect(testBoard.isLegalMove(new Position(0,0), new Position(5,0))).toBe(false);
        testBoard.setPieceAt(new Position(5,2), new Piece(Rank.Colonel, Side.Red));
        testBoard.setPieceAt(new Position(6,2), new Piece(Rank.Colonel, Side.Blue));

    })

    it("tileType move tests", ()=>{
        const testBoard = new JunqiBoard("????? ????? ????? ????? ????? ????? ????? ????? ????? ????? ????? ?????");
        testBoard.setPieceAt(new Position(0,1), new Piece(Rank.Flag, Side.Blue));
        testBoard.setPieceAt(new Position(1,1), new Piece(Rank.Colonel, Side.Red));
        testBoard.setPieceAt(new Position(1,0), new Piece(Rank.Colonel, Side.Blue));
        expect(testBoard.isLegalMove(new Position(0,1), new Position(0,2))).toBe(false);
        expect(testBoard.makeMove(new Position(1,1), new Position(2,1))).toBe(true);
        expect(testBoard.makeMove(new Position(1,0), new Position(2,1))).toBe(false);





        



    })


})