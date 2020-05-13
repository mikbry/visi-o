import { serveTLS } from "https://deno.land/std/http/server.ts";
import {
  acceptable,
  acceptWebSocket,
  isWebSocketCloseEvent,
} from "https://deno.land/std/ws/mod.ts";

export default class WSServer {
  constructor(httpServer) {
    this.httpServer = httpServer;
  }

  async handleSocket(ws) {
    try {
      console.log("socket connected! ", ws.request.url);
      ws.send = message => ws.sock.send(message);
      const context = await ws.handler('connection', null, ws);
      try {
        for await (const ev of ws.sock) {
          if (isWebSocketCloseEvent(ev)) {
            // close
            const { code, reason } = ev;
            console.log("ws:Close", code, reason);
            await ws.handler('close', context, ev);
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
    } catch (err) {
      console.error(`failed to accept websocket: ${err}`);
      await ws.request.respond({ status: 400 });
    }
  }

  async listen({ port }) {
    const options = {
      port: port,
      certFile: `${Deno.cwd()}/certs/localhost+2.pem`,
      keyFile: `${Deno.cwd()}/certs/localhost+2-key.pem`,
    };
    const server = serveTLS(options);
    for await (const request of server) {
      if (acceptable(request)) {
        const route = this.routes.find(route => route.url === request.url || route.url === '*');
        console.log('request.path', request.url,);
        if (route) {
          try {
            console.log("new request ", request.url);
            const { conn, r: bufReader, w: bufWriter, headers } = request;
            acceptWebSocket({
              conn,
              bufReader,
              bufWriter,
              headers,
            }).then(sock => this.handleSocket({ sock, request, route }));
          } catch (err) {
            console.error(`failed to accept websocket: ${err}`);
            await request.respond({ status: 400 });
          }
        }
      }
    }
  }

  ws(url = '*', handler) {
    const wsHandler = async (request) => {
      if (acceptable(request)) {
        console.log('request.path', request.url,);
        try {
          console.log("new request ", request.url);
          const { conn, r: bufReader, w: bufWriter, headers } = request;
          acceptWebSocket({
            conn,
            bufReader,
            bufWriter,
            headers,
          }).then(sock => this.handleSocket({ sock, request, handler }));
        } catch (err) {
          console.error(`failed to accept websocket: ${err}`);
          await request.respond({ status: 400 });
        }
      }
    };
    this.httpServer.get(url, wsHandler);
  }
}


