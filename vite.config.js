// vite.config.js
import glsl from "vite-plugin-glsl";
import { defineConfig } from "vite";
import dns from "node:dns";

dns.setDefaultResultOrder("verbatim");

///*

import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the static HTML page
app.use(express.static(path.join(__dirname, "public")));

// Array to store connected sockets
const connectedSockets = [];

// init numeri sequenziali per client
let sequenceNumberByClient = new Map();

// quando si collega un client
io.on("connection", (socket) => {
  console.info(`Client connected [id=${socket.id}]`);

  // initialize this client's sequence number
  sequenceNumberByClient.set(socket, 1);
  connectedSockets.push(socket);
  for (const [client, sequenceNumber] of sequenceNumberByClient.entries()) {
    sequenceNumberByClient.set(client, sequenceNumber + 1);
    client.emit("seq-num", `Client connected ${connectedSockets.length}`);
  }
  // quando si scollega un client, eliminalo
  socket.on("disconnect", () => {
    sequenceNumberByClient.delete(socket);
    console.info(`Client gone [id=${socket.id}]`);
    for (const [client, sequenceNumber] of sequenceNumberByClient.entries()) {
      client.emit("seq-num", `Client gone ${connectedSockets.length}`);
    }
    // Remove the socket from the array
    const index = connectedSockets.indexOf(socket);
    if (index > -1) {
      connectedSockets.splice(index, 1);
    }
  });

  // csound
  socket.on("csound", (arg) => {
    const messageArray = String(arg).split(/[\\s*]+/);
    // [0]controll message [1 controll value]
    for (const [client] of sequenceNumberByClient.entries()) {
      client.emit("csound", messageArray);
    }
  });

  // PINK
  socket.on("pink", (arg) => {
    const messageArray = String(arg).split(/[\\s*]+/);
    // [0]controll message [1 controll value]
    for (const [client] of sequenceNumberByClient.entries()) {
      client.emit("pink", messageArray);
    }
  });

  // SINE
  socket.on("sine", (arg) => {
    const messageArray = String(arg).split(/[\\s*]+/);
    // [0]controll message [1 controll value]
    for (const [client] of sequenceNumberByClient.entries()) {
      client.emit("sine", messageArray);
    }
  });

  // SAW
  socket.on("saw", (arg) => {
    const messageArray = String(arg).split(/[\\s*]+/);
    // [0]controll message [1 controll value]
    for (const [client] of sequenceNumberByClient.entries()) {
      client.emit("saw", messageArray);
    }
  });
  // PINK
  socket.on("pink2", (arg) => {
    const messageArray = String(arg).split(/[\\s*]+/);
    // [0]controll message [1 controll value]
    for (const [client] of sequenceNumberByClient.entries()) {
      client.emit("pink2", messageArray);
    }
  });

  // SINE
  socket.on("sine2", (arg) => {
    const messageArray = String(arg).split(/[\\s*]+/);
    // [0]controll message [1 controll value]
    for (const [client] of sequenceNumberByClient.entries()) {
      client.emit("sine2", messageArray);
    }
  });

  // SAW
  socket.on("saw2", (arg) => {
    const messageArray = String(arg).split(/[\\s*]+/);
    // [0]controll message [1 controll value]
    for (const [client] of sequenceNumberByClient.entries()) {
      client.emit("saw2", messageArray);
    }
  });

  // audioPlayer
  socket.on("audioPlayer", (arg) => {
    const messageArray = String(arg).split(/[\\s*]+/);
    // [0]controll message [1 controll value]
    for (const [client] of sequenceNumberByClient.entries()) {
      client.emit("audioPlayer", messageArray);
    }
  });

  // audioPlayer2
  socket.on("audioPlayer2", (arg) => {
    const messageArray = String(arg).split(/[\\s*]+/);
    // [0]controll message [1 controll value]
    for (const [client] of sequenceNumberByClient.entries()) {
      client.emit("audioPlayer2", messageArray);
    }
  });

  // initRGB
  socket.on("initRGB", (arg) => {
    const messageArray = String(arg).split(/[\\s*]+/);
    // [0]controll message [1 controll value]
    for (const [client] of sequenceNumberByClient.entries()) {
      client.emit("initRGB", messageArray);
    }
  });

  // strobe
  socket.on("strobe", (arg) => {
    const messageArray = String(arg).split(/[\\s*]+/);
    // [0]controll message [1 controll value]
    for (const [client] of sequenceNumberByClient.entries()) {
      client.emit("strobe", messageArray);
    }
  });

  // metro
  socket.on("metro", (arg) => {
    const messageArray = String(arg).split(/[\\s*]+/);
    // [0]controll message [1 controll value]
    for (const [client] of sequenceNumberByClient.entries()) {
      client.emit("metro", messageArray);
    }
  });

  // Change Scene
  socket.on("chgScn", (arg) => {
    const messageArray = String(arg).split(/[\\s*]+/);
    // [0]controll message [1 controll value]
    for (const [client] of sequenceNumberByClient.entries()) {
      client.emit("chgScn", messageArray);
    }
  });

  // Handle the 'toDevice' message
  socket.on("toDevice", (message) => {
    const messageParts = message.split("*");
    if (messageParts.length < 2) {
      console.error("Invalid message format");
      return;
    }

    const targetIndex = parseInt(messageParts[0], 10); // Convert index to number
    const event = messageParts[1];
    const args = messageParts.slice(2);

    console.log(`Target Index: ${targetIndex}, Event: ${event}, Args: ${args}`);

    const targetSocket = connectedSockets[targetIndex - 1]; // Adjust for zero-based index

    if (targetSocket) {
      console.log(
        `Sending event '${event}' to socket with index ${targetIndex}, ID: ${targetSocket.id}`
      );
      targetSocket.emit(event, args);
    } else {
      console.error(`Socket at index ${targetIndex} not found.`);
    }
  });
  //
});

// manda ad ogni client un counter diverso
// setInterval(() => {
//   for (const [client, sequenceNumber] of sequenceNumberByClient.entries()) {
//     client.emit("seq-num", sequenceNumber);
//     sequenceNumberByClient.set(client, sequenceNumber + 1);
//   }
// }, 1000);

server.listen(5174, () => {
  console.log("Server is listening on port 8000");
});

//*/

export default defineConfig({
  server: {
    proxy: {
      "/socket.io": {
        target: "ws://localhost:5174",
        ws: true,
      },
    },
  },
  plugins: [glsl()],
});
