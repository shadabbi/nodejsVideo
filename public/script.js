const socket = io("/");
const vid = document.querySelector(".vid");

var constraints = { audio: true, video: { width: 300, height: 200 } };

navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
  var video = document.createElement("video");

  addVideoStream(video, mediaStream);

  socket.on("user-connnected", (userId) => {
    connectToNewUser(userId, mediaStream);
  });

  peer.on("call", function (call) {
    console.log("clled");
    alert("called");
    call.answer(mediaStream); // Answer the call with an A/V stream.
    call.on("stream", function (userVid) {
      // Show stream in some video/canvas element.
      addVideoStream(video, userVid);
    });
  });
});

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: port,
  // port: 3000,
});

console.log(port);

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

const connectToNewUser = (userId, mediaStream) => {
  alert("tes");
  var call = peer.call(userId, mediaStream);
  const video = document.createElement("video");
  call.on("stream", function (stream) {
    addVideoStream(video, stream);
    console.log("stream");
  });
};

const addVideoStream = (video, mediaStream) => {
  video.srcObject = mediaStream;
  vid.append(video);
  video.onloadedmetadata = function (e) {
    video.play();
  };
};
