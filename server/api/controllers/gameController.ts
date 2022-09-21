import { SocketController, SocketIO, OnMessage, MessageBody, ConnectedSocket } from "socket-controllers"; 
import { Server, Socket } from "socket.io";
import { setReadyJunqiGame } from "./JunqiGameDBController";

@SocketController()
export class GameController {
    private getSocketGameRoom(socket: Socket): string {
        const socketRooms = Array.from(socket.rooms.values()).filter((r) => r != socket.id);
        const gameRoom = socketRooms && socketRooms[0];
        
        return gameRoom
    }

    @OnMessage("ready_up")
    public async readyUp(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        const gameRoom = this.getSocketGameRoom(socket);
        //socket.to(gameRoom).emit("ready_up_response", { sid : socket.id });
        console.log(`Recieved ready_up request from socket (${socket.id})`)
        setReadyJunqiGame(socket.id, gameRoom, true).then((allReady) => {
            socket.emit("ready_up_response", { state : true })
            if(allReady) {
                socket.to(gameRoom).emit("room_state_changed", {
                    state: "play"
                })
            }
        })
        .catch((err) => {
            console.log(`"Failed to set ready-up: ${err}`)
        })
        
    }
    @OnMessage("update_game")
    public async updateGame(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {
        const gameRoom = this.getSocketGameRoom(socket);
        socket.to(gameRoom).emit("on_game_update", message);
    }
}