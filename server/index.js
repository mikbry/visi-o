import { serve } from "https://deno.land/std/http/server.ts";
import { Application, send } from "https://deno.land/x/oak/mod.ts";
import { WSServer } from "./services/WSServer.js";
import SignalingServer from './services/SignalingServer.js';

const APP_PORT = 4000;

const app = new Application();

app.use(async (context) => {
  console.log(Deno.cwd());
  console.log(context.request.path);
  await send(context, '', {
    root: `${Deno.cwd()}/public`,
    index: "index.html",
  });
});

const wss = new WSServer();
const signaling = new SignalingServer();
wss.ws('/ws', async (type, context, data) => {
  return signaling.handleWS(type, context, data);
});

window.onload = async () => {
  await wss.listen({ port: APP_PORT });
};

/* (async () => {
  await app.listen({ port: APP_PORT });
})(); */

console.log(`DinoCam listening on port ${APP_PORT}`);