import { serve, serveTLS } from "https://deno.land/std/http/server.ts";

export default class HttpServer {
  constructor() {
    this.routes = [];
  }

  async listen(options) {
    if (options.certFile && options.keyFile) {
      this.server = serveTLS(options);
    } else {
      this.server = serve(options);
    }
    for await (const request of this.server) {
      const route = this.routes.find(route => route.method === request.method && (route.url === request.url || route.url === '*'));
      console.log('request', route, request.url);
      if (route) {
        route.handler(request).then();
      }
    }
  }

  get(url, handler) {
    this.routes.push({ method: 'GET', url, handler });
  }
}