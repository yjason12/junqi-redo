import mongoose, { Document, Schema } from "mongoose";

export interface IRoomToGame {
    roomname : string;
    gamename : string;
}

export interface IRoomToGameModel extends IRoomToGame, Document {};

const IRoomToGameSchema : Schema = new Schema({
    roomname : { type : String, required : true },
    gamename : { type : String, required : true }
});

export default mongoose.model<IRoomToGameModel>("RoomToGame", IRoomToGameSchema);