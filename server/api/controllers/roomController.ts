import { SocketController, SocketIO, OnMessage, MessageBody, ConnectedSocket } from "socket-controllers"; 
import { Server, Socket } from "socket.io";
import { Gateway } from "../../models/gateway";
import { createJunqiGame, hasJunqiGame, addPlayerToJunqiGame } from "./JunqiGameDBController";

@SocketController()
export class RoomController {

    @OnMessage("join_room")
    public async joinGame(@SocketIO() io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any) {

        console.log("New user requesting to join room: ", message);

        if(!("roomId" in message)) {
            console.log("Invalid message object, requires roomId field")
            return;
        }

        if(message.roomId.trim() === "") {
            console.log("Invalid roomId (cannot be empty): ", message.roomId);
            return;
        }

        const connectedSockets = io.sockets.adapter.rooms.get(message.roomId);
        const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id);
        
        if(socketRooms.length > 0) {
            socket.emit("join_room_response", {
                    result: "failure",
                    reason: "Already in room"
            });
            console.log(`Socket (${socket.id}) tried to join room (${message.roomId}) but is already in a room`)
        } else if(connectedSockets && connectedSockets.size === 2) {
            socket.emit("join_room_response", {
                    result: "failure",
                    reason: "Room is full"
            });
            console.log(`Socket (${socket.id}) tried to join room (${message.roomId}) but it was full`)
        } else {
            await socket.join(message.roomId);
            socket.emit("join_room_response", {
                    result: "success",
                    reason: "Successfully joined room"
            });

            //Gateway.AddPlayerToRoom(socket.id, message.roomId);
            //createRoomToGame(message.roomId, message.roomId);

            console.log(`Socket (${socket.id}) joined room (${message.roomId})`)
            const connectedSockets = io.sockets.adapter.rooms.get(message.roomId);
            if(connectedSockets?.size === 2) {
                if(!(await hasJunqiGame(message.roomId))){
                    console.log(`Starting game in room (${message.roomId})`);
                    createJunqiGame(message.roomId, connectedSockets).then(() => {
                        io.to(message.roomId).emit("start_game", {
                            start: true,
                            startingPlayer: socket.id
                        })
                    });

                } else {
                    console.log(`Adding player ${socket.id} to room ${message.roomId}`);
                    addPlayerToJunqiGame(socket.id, message.roomId);
                    io.to(message.roomId).emit("start_game", {
                        start: true,
                        startingPlayer: socket.id
                    })
                }
            }
        }
    }
}