import express from "express";
import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import { createServer } from "http";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

/*
  emit => publish to an event using emit("eventName", data)
  on => listen for connections with same event name also with callback function on(eventName, callback)
*/

io.on("connection", (socket) => {
  console.log("A user connected with socket id " + socket.id);

  // on function : will listen for connections with same event name also with callback function
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);

    io.emit("send_all", msg);
  });

  socket.on("typing", (value) => {
    socket.broadcast.emit("show_typing_status", value);
    // broadcast mean will emit but unless the client who sent the message
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
server.listen(process.env.PORT || 4000, () => {
  console.log("listening on port " + process.env.PORT);
});
