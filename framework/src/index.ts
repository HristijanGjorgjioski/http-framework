import * as net from "net";
import { parseHttpRequest } from "./utils/parseHttpRequest";
import { createHttpResponse } from "./utils/createHttpResponse";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export type Request = {
  method: HttpMethod;
  path: string;
  headers: Headers;
  body: string;
  query: Record<string, string>;
};

export type Response = {
  send: (body: string) => void;
  status: (code: number) => { json: (body: any) => void };
};

export type Handler = (req: Request, res: Response) => void;

export class Server {
  private routes: Record<string, Handler> = {};

  private addRoute(method: string, path: string, handler: Handler) {
    this.routes[`${method}:${path}`] = handler;
  }

  public get(path: string, handler: Handler) {
    this.addRoute(HttpMethod.GET, path, handler);
  }

  public post(path: string, handler: Handler) {
    this.addRoute(HttpMethod.POST, path, handler);
  }

  public listen(port: number, callback: () => void) {
    const server = net.createServer((socket) => {
      socket.on("data", (data) => {
        const request = parseHttpRequest(data.toString());
        const key = `${request.method}:${request.path}`;
        const handler = this.routes[key];

        if (!handler) {
          const response = createHttpResponse(
            404,
            "Not Found",
            { "Content-Type": "text/plain" },
            "Page Not Found"
          );
          socket.write(response);
          socket.end();
          return;
        }

        const res: Response = {
          send: (body: string) =>
            socket.end(createHttpResponse(200, "OK", {}, body)),
          status: (code: number) => ({
            json: (body: any) =>
              socket.end(
                createHttpResponse(
                  code,
                  "OK",
                  { "Content-Type": "application/json" },
                  JSON.stringify(body)
                )
              ),
          }),
        };

        try {
          handler(request, res);
        } catch (error) {
          const errorResponse = createHttpResponse(
            500,
            "Internal Server Error",
            { "Content-Type": "text/plain" },
            "Something went wrong!"
          );
          socket.write(errorResponse);
          socket.end();
        }
      });
    });

    server.listen(port, callback);
  }
}
