const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

const port = process.env.PORT;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res, next) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room, port: port });
});

const server = app.listen(port);

const { ExpressPeerServer } = require("peer");

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use("/peerjs", peerServer);

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("connected!");
  socket.on("join-room", (roomId, userId) => {
    console.log("joined!");
    socket.to(roomId).emit("user-connnected", userId);
    socket.join(roomId);
  });
});
