const socket = io("/");
const vid = document.querySelector(".vid");
const video = document.createElement("video");

const peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: port,
  // port: 3030,
});

console.log(port);
alert(port);

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

const constraints = { audio: true, video: { width: 300, height: 200 } };

navigator.mediaDevices.getUserMedia(constraints).then((mediaStream) => {
  addVideoStream(video, mediaStream);

  peer.on("call", (call) => {
    alert("called");
    console.log("clled");
    call.answer(mediaStream); // Answer the call with an A/V stream.
    const video = document.createElement("video");
    call.on("stream", (userVid) => {
      // Show stream in some video/canvas element.
      addVideoStream(video, userVid);
    });
  });

  socket.on("user-connected", (userId) => {
    alert("user-connected");
    connectToNewUser(userId, mediaStream);
  });
});

const connectToNewUser = (userId, mediaStream) => {
  alert("connected new");
  const call = peer.call(userId, mediaStream);
  console.log(call);

  const video = document.createElement("video");
  call.on("stream", (userstream) => {
    alert("vide stream added");
    addVideoStream(video, userstream);
    console.log("stream");
  });
};

const addVideoStream = (video, mediaStream) => {
  video.srcObject = mediaStream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  vid.append(video);
};
