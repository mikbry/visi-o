import { serve } from "https://deno.land/std/http/server.ts";
import { Context, compose } from "https://deno.land/x/oak/mod.ts";

export class HttpApplication {
  constructor() {
    this.middlewares = [];
  }

  async handleRequest(request, middleware) {
    const context = new Context(this, request);
    await middleware(context);
    await request.respond(context.response.toServerResponse());
  }

  async listen(addr, port) {
    const middleware = compose(this.middlewares);
    this.server = serve(addr, port);
    for await (const request of this.server) {
      this.handleRequest(request, middleware);
    }
  }

  use(...middlewares) {
    this.middlewares.push(...middlewares);
    return this;
  }
}