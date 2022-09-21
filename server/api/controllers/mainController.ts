import { OnDisconnect, SocketController, OnMessage } from "socket-controllers";
import { Socket, Server } from "socket.io";
import { ConnectedSocket, OnConnect, SocketIO } from "socket-controllers";
import { deletePlayerFromJunqiGame, deleteJunqiGame } from "./JunqiGameDBController";

@SocketController()
export class MainController {
    private getSocketGameRoom(socket: Socket): string {
        const socketRooms = Array.from(socket.rooms.values()).filter((r) => r != socket.id);
        const gameRoom = socketRooms && socketRooms[0];

        return gameRoom
    }

    @OnConnect()
    public onConnection(
        @ConnectedSocket() socket: Socket,
        @SocketIO() server: Server) {
            console.log(`Socket Connected: ${socket.id}`);
    }
    @OnMessage("disconnecting")
    public preDisconnect(@ConnectedSocket() socket: Socket, @SocketIO() server: Server) {
        console.log(`Socket disconnected: ${socket.id}`);
        const gameRoom = this.getSocketGameRoom(socket);
        deletePlayerFromJunqiGame(socket.id);
    }
}