import http from "node:http";
import { WebSocketServer, WebSocket } from "ws";

const httpServer = http.createServer();

const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (ws: WebSocket) => {
  ws.on("error", (error) => {
    console.log(
      "Somethin went wrong while connecting to the WebSocket Server",
      error
    );
  });

  ws.on("message", (data) => {
    console.log(data.toString());

    wss.clients.forEach((client) => {
      if (ws !== client && ws.readyState == client.OPEN) {
        ws.send(JSON.stringify(data));
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.send("Something");
});

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`SERVER is up and running on PORT: ${PORT}`);
});
