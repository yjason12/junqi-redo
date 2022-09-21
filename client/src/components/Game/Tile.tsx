import "./Tile.css";

interface TileProps {
    piece : number
    side: string
    r: number
    c: number
}

//return a tile component depending on the piece, side, and position passed in.
export default function Tile({piece, side, r, c} : TileProps) {
    let campsites: [number, number][];
    let headquarters: [number, number][];

    //define positions for diff tile types
    campsites = [[2,1], [3,2], [8,2], [2,3], [4,1],[4,3], [7,1],[7,3], [9,1],[9,3]];
    headquarters = [[0,1], [0,3], [11,1], [11,3]];
    
    let tileType = "default"
    let sideType = "empty";
    let pieceRank = "";

    if(piece !== -2){// -2 is "no piece" rank fyi
        pieceRank = pieceRank + piece;
    }

    //determine and set tiletype
    if(contains(campsites, r, c)){
        tileType ="campsite";
    } else if(contains(headquarters, r, c)){
        tileType ="hq";
    } 
    
    //set side
    if(side === "blue"){
        sideType = "blueSide";
    } else if(side === "red"){
        sideType = "redSide";
    } else if (side === "neither"){
        sideType = "empty"
    }

    return <div className = {"tile " + tileType + " " + sideType} >{pieceRank}</div>;
        
}

//helper function to determine whether a position is a specific tile type
function contains(tiles: [number, number][], r : number, c : number) : boolean{

    for (let i = 0; i < tiles.length; i++){
        let item = tiles[i];

        if(item[0] === r && item[1] === c){
            return true;
        }
    }

    return false;
}