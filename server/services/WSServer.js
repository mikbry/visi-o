import { serve } from "https://deno.land/std/http/server.ts";
import {
  acceptWebSocket,
  isWebSocketCloseEvent,
  isWebSocketPingEvent,
} from "https://deno.land/std/ws/mod.ts";

export class WSServer {
  constructor() {
    this.wss = [];
  }

  async handleSocket(sock, request) {
    try {
      let ws = this.wss.find(w => w.url === request.url || w.url === '*');
      console.log('request.path', request.path, request.url, ws);
      if (ws) {
        console.log("socket connected! ", request.url);
        ws.send = async message => sock.send(message);
        const context = await ws.handler('connection', null, ws);
        context.ws = ws;
        try {
          for await (let ev of sock) {
            if (isWebSocketPingEvent(ev)) {
              const [, body] = ev;
              // ping
              console.log("ws:Ping", body);
              await ws.handler('ping',context, ev);
            } else if (isWebSocketCloseEvent(ev)) {
              // close
              const { code, reason } = ev;
              console.log("ws:Close", code, reason);
              await ws.handler('close',context, ev);
            } else {
              await ws.handler('message', context, ev);
            }
          }
          console.log('closed sock');
        } catch (err) {
          console.error(`failed to receive frame: ${err}`);
  
          if (!sock.isClosed) {
            await sock.close(1000).catch(console.error);
          }
        }
      } else {
        if (!sock.isClosed) {
          await sock.close(1000).catch(console.error);
        }
      }
    } catch (err) {
      console.error(`failed to accept websocket: ${err}`);
      await request.respond({ status: 400 });
    }
  }

  async listen({ port }) {
    const server = serve(`:${port}`);
    for await (let request of server) {
      console.log("new request ", request.url);
      const { conn, r: bufReader, w: bufWriter, headers } = request;
      const sock = await acceptWebSocket({
        conn,
        bufReader,
        bufWriter,
        headers,
      });
      await this.handleSocket(sock, request);
    }
  }

  ws(url = '*', handler) {
    this.wss.push({ url, handler });
  }
}


