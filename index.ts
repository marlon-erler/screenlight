const prompt = "Type something: ";

const PORT: number = parseInt(Bun.argv[0]) || 8080;

import { ServerWebSocket } from "bun";
import { isNull } from "util";

let hue: number = 0;
let sat: number = 100;
let lum: number = 50;

const colorString = () => `hsl(${hue}, ${sat}%, ${lum}%)`;

const sockets = new Set<ServerWebSocket<any>>();

Bun.serve({
  port: PORT,

  fetch(request, server) {
    server.upgrade(request);
    return new Response(Bun.file("page.html"));
  },

  websocket: {
    message(ws, message) {
      changeColorByCommand(message.toString());
    },
    open(ws) {
      console.log("ws connected");
      sockets.add(ws);
      sendColor(ws);
    },
    close(ws, code, reason) {
      console.log("ws closed");
      sockets.delete(ws);
    },
  },
});

function sendColor(ws: ServerWebSocket<any>) {
  ws.send(colorString());
}

function sendColorToAll() {
  sockets.forEach(sendColor);
}

function changeColorByCommand(command: string) {
  command.split(" ").forEach((word) => {
    const marker = word.substring(0, 1);
    const value = word.substring(1);

    const numericValue: number = parseInt(value);
    if (isNaN(numericValue)) return;

    switch (marker) {
      case "h": {
        hue = numericValue;
        return;
      }
      case "s": {
        sat = numericValue;
        return;
      }
      case "l": {
        sat = numericValue;
        return;
      }
    }
  });
  sendColorToAll();
}

console.log("Running");
console.log("===");

process.stdout.write("change color > ");
for await (const line of console) {
  changeColorByCommand(line);
}
