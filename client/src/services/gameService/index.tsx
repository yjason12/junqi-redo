import { Socket } from "socket.io-client";
import { IGameState, IReadyUp } from "../../components/Game/Game";
import { IStartGame } from "../../components/LobbyPage";

class GameService {

    /**
     * method for user to request to join a room
     * 
     * @param socket socket of user
     * @param roomID id of room that user is trying to join
     * @returns true or false depending on whether user successfully joined the room
     */
    public async joinGameRoom(socket: Socket, roomID: string): Promise<boolean> {
        return new Promise((rs, rj) => {
            //signal to backend
            socket.emit("join_room", {
                "roomId": roomID
            });
            
            //response from backend, returns object with result and reason
            socket.on("join_room_response", (res) => {
                // server will send a response object after joining room
                if(!("result" in res)) rj("Invalid response object! Requires result field");
                if(res["result"] === "success") {
                    console.log("Successfully joined room: ", roomID)
                    rs(true);
                } else if(res["result"] === "failure") {
                    if(!("reason" in res)) {
                        rj("Invalid response object! Requires reason field");
                    } else {
                        rj("Error joining room: " + res["reason"]);
                    }
                }
            });
        });
    }

    
    public async onStartGame(socket: Socket, listener: (options: IStartGame) => void) {
        socket.on("start_game", listener);
    }

    public async onReadyUp(socket: Socket, setter : (val: IReadyUp) => void): Promise<boolean> {
        return new Promise((rs, rj) => {
            socket.emit("ready_up");
            socket.on("ready_up_response", setter);
            rs(true);
        })
    }

    public async onRoomStateChange(socket: Socket, listener: (val: IGameState) => void) {
        socket.on("room_state_changed", listener);
    }
}

export default new GameService();