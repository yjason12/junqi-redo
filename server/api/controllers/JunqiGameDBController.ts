import mongoose from "mongoose";
import { IBoard } from "../../models/interfaces/IBoard";
import JunqiGame, { Side } from "../../models/interfaces/IJunqiGame";
import { JunqiBoard } from "../../models/JunqiBoard";

const createJunqiGame = (roomName: string, connectedSockets: Set<string>) => {
    console.log(`Creating JunqiGame: ${roomName}`);

    const jb = new JunqiBoard();

    const jg = new JunqiGame({
        name: roomName,
        board: jb,
        turn: 0,
        started: false,
        players: [],
        ready: new Map([]),
    });
    connectedSockets.forEach((s) => {
        jg.players.push(s);
        jg.ready.set(s, false)
    });

    return jg.save();
};

const hasJunqiGame = async (gameName: string): Promise<boolean> => {
    return new Promise<boolean>((rs, rj) => {
        JunqiGame.exists({ name: gameName }).exec()
            .then((res: any) => {
                rs(res != null);
            })
            .catch((err: string) => {
                rj("Could not check if game exists in database: " + err);
            })
    });
}
const updateJunqiGame = async (board: IBoard, gameName: string) => {
    console.log(`Updating game ${gameName}`);
    if (await hasJunqiGame(gameName)) {
        JunqiGame.updateOne({ name: gameName }, { board: board });
    } else {
        console.log(`Game ${gameName} does not exist : updating Junqi Game`)
    }
    return;
}

const setReadyJunqiGame = async (playerName: string, gameName: string, state: boolean) => {
    if (await hasJunqiGame(gameName)) {
        console.log(`Readying player: ${playerName} in JunqiGame: ${gameName}`);
        const game = await JunqiGame.find({ name: gameName });
        if (game[0].players.includes(playerName)) {
            game[0].ready.set(playerName, state);
        }

        let allReady: boolean = true;
        for (let [key, val] of game[0].ready) {
            allReady &&= val;
        }
        await game[0].save();

        if (game[0].ready.size == 2 && allReady) {
            console.log(`Sending all ready signal to room ${gameName}`);
            return true;
        }
        return false;
    } else {
        console.log(`Game ${gameName} does not exist : set ready`)
    }
}

const flipReadyJunqiGame = async (playerName: string, gameName: string) : Promise<boolean> => {
    console.log(`Flipping ready state for player: ${playerName} in JunqiGame: ${gameName}`);
    return new Promise<boolean>(async (rs, rj) => {
        if (await hasJunqiGame(gameName)) {
            console.log(`Successfully found game ${gameName}`)
            const game = await JunqiGame.find({ name: gameName });
            let newBool : boolean = false;
            if (game[0].players.includes(playerName)) {
                newBool = !game[0].ready.get(playerName);
                game[0].ready.set(playerName, newBool);
            }

            let allReady : boolean = true;
            for (let [key, val] of game[0].ready) {
                allReady &&= val;
            }
            await game[0].save();

            if(game[0].ready.size == 2 && allReady) {
                console.log(`Sending all ready signal to room ${gameName}`);
            }
            rs(newBool);
        } else {
            console.log(`Game ${gameName} does not exist : flipping JunqiGame`);
        }
    });
}

const startJunqiGame = async (gameName: string) => {
    if (await hasJunqiGame(gameName)) {
        console.log(`Starting JunqiGame: ${gameName}`);
        const game = await JunqiGame.find({ name: gameName });

        game[0].started = true;
        await game[0].save();
    } else {
        console.log(`Game ${gameName} does not exist : start JunqiGame`);
    }
}

const addPlayerToJunqiGame = async (playerName: string, gameName: string) => {
    if (await hasJunqiGame(gameName)) {
        console.log(`Starting JunqiGame: ${gameName}`);
        JunqiGame.find({ name: gameName }).exec()
            .then(async (games) => {
                for (let i = 0; i < 2; i++) {
                    if (games[0].players[i] === "") {
                        games[0].players[i] = playerName;
                        games[0].ready.set(playerName, false);
                        await games[0].save();
                        return;
                    }
                }
            })
            .catch((err) => {
                console.log(err)
            })
    } else {
        console.log(`Game ${gameName} does not exist : adding player`);
    }
    return;
}

const deletePlayerFromJunqiGame = async (playerName: string) => {
    try {
        console.log(`Deleting player ${playerName} from JunqiGame`);
        const game = await JunqiGame.find({ players: playerName });

        if (game.length == 0) {
            console.log("Player (somehow) left game that does not exist.")
            return;
        }
        /*
        for (let i = 0; i < 2; i++) {
            if (game[0].players[i] === playerName) {
                game[0].players[i] = "";
                await game[0].save();
            }
        }
        */
        var ind = game[0].players.indexOf(playerName);
        if (ind !== -1) {
            game[0].players[ind] = "";
            game[0].ready.delete(playerName);
            await game[0].save();
        }
        if (game[0].players[0] === "" && game[0].players[1] === "") {
            await deleteJunqiGame(game[0].name);
        }
        //console.log(game);


    } catch (e) {
        console.log(e);
    }

};

const deleteJunqiGame = async (gameName: string) => {
    console.log(`Deleting JunqiGame ${gameName} in db`);
    return JunqiGame.deleteOne({ name: gameName });
};

const getJunqiGameClientJSON = async (gameName: string, socketID: string) => {
    const game = await JunqiGame.find({ name: gameName });
    if (game.length == 0) {
        console.log("Tried to send Client JSON to room that doesn't exist");
        return;
    }

    console.log(game[0].players)
    console.log(socketID)
    const socketIndex = game[0].players.indexOf(socketID);
    if(socketIndex == -1) {
        console.log("Tried to get Client JSON for socket not found in game")
        return;
    }

    console.log(game[0].board)

    return game[0].board.toClientJSON("Red");
}


export { getJunqiGameClientJSON, createJunqiGame, setReadyJunqiGame, hasJunqiGame, addPlayerToJunqiGame, startJunqiGame, updateJunqiGame, deletePlayerFromJunqiGame, deleteJunqiGame };
