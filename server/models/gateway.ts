import { IJunqiGame } from "./interfaces/IJunqiGame"

export class Gateway {
    GameRoomMap : Map<string, IJunqiGame>;
    PlayerToRoom : Map<string, string>;
    constructor () {
        this.GameRoomMap = new Map([]);
        this.PlayerToRoom = new Map([]);
    }

    AddPlayerToRoom(socketId : string, roomId : string) : void {
        console.log(`${socketId} added to room ${roomId}`)
        this.PlayerToRoom.set(socketId, roomId);
    }
}