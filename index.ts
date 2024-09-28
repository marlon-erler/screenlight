Bun.serve({
  port: 8080,

  fetch(request, server) {},

  websocket: {
    message(ws, message) {},
    open(ws) {},
  },
});
