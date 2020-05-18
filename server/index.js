import HttpServer from "./services/HttpServer.js";
import WSServer from "./services/WSServer.js";
import SignalingServer from './services/SignalingServer.js';

const APP_PORT = 4000;
const options = {
  port: APP_PORT,
  certFile: `${Deno.cwd()}/certs/localhost+2.pem`,
  keyFile: `${Deno.cwd()}/certs/localhost+2-key.pem`,
};

const http = new HttpServer();
const wss = new WSServer(http);

const signaling = new SignalingServer();
wss.ws('/ws', async (type, context, data) => {
  return signaling.handleWS(type, context, data);
});
http.get('/api/room', async (request) => {
  const rooms = signaling.getRooms();
  const body = JSON.stringify({ rooms });
  return request.respond({
    status: 200,
    headers: new Headers({
      "content-type": "application/json",
      "access-control-allow-origin": "*",
    }),
    body,
  });
});

window.onload = async () => {
  // await wss.listen({ port: APP_PORT });
  await http.listen(options);
};

console.log(`Din-O listening on port ${options.port}`);