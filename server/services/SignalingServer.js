import { v4 } from "https://deno.land/std/uuid/mod.ts";

export default class SignalingServer {
  constructor() {
    this.clients = [];
  }

  createClient(ws) {
    const id = v4.generate();
    const context = { id, ws };
    this.clients.push(context);
    console.log('Client connected', id);
    return context;
  }

  closeClient(id) {
    this.clients = this.clients.filter(client => client.id !== id);
    console.log('Client disconnected', id);
  }

  async handleMessage(id, message) {
    // console.log(message, typeof message);
    for await (const client of this.clients) {
      if (client.id !== id) {
        console.log('send message ', client.id);
        client.ws.send(message);
      }
    }
  }

  async handleWS(type, context, data) {
    // console.log('ws handler ', type);
    if (type === 'message') {
      console.log('got message ', context.id);
      return this.handleMessage(context.id, data);
    } else if (type === 'connection') {
      return this.createClient(data);
    } else if (type === 'close') {
      return this.closeClient(context.id);
    }
  }
};