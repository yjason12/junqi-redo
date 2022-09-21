import "reflect-metadata";
import app from "./app";
import * as http from "http";
import socketServer from "./socket";
import mongoose from "mongoose";
import { config } from "./config/dbconfig";

require('dotenv').config()

var port = process.env.PORT || "8000"
app.set("port", port);

var server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

mongoose.connect(config.mongo.url, { retryWrites : true, w : "majority"})
  .then(() => { console.log("connected to MongoDB") })
  .catch((error) => { console.log(error) });

const io = socketServer(server);

function onError(error:NodeJS.ErrnoException) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  if(!addr) throw "Address is NULL";
  console.log("Server Running on Port: ", port);
}