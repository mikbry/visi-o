export default class SignalingServer {
  constructor() {
    this.clients = [];
  }

  createClient() {
    const id = (Math.random() * 10000);
    const context = { id };
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
        await client.ws.send(message);
      }
    }
  }

  async handleWS(type, context, data) {
    // console.log('ws handler ', type);
    if (type === 'message') {
      console.log('got message ', context.id);
      return this.handleMessage(context.id, data);
    } else  if (type === 'connection') {
      return this.createClient();
    } else  if (type === 'close') {
      return this.closeClient(context.id);
    }
  }
};