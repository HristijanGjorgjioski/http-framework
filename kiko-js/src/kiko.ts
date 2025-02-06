import * as net from "net";
import { Handler, HttpMethod, Response } from "./types";
import { parseFormData, parseHttpRequest, createHttpResponse } from "./utils";

export class Server {
  private routes: Record<string, Handler> = {};

  private _parseRoute(path: string) {
    return path.replace(/:([a-zA-Z0-9_]+)/g, "([^/]+)");
  }

  private addRoute(method: string, path: string, handler: Handler) {
    this.routes[`${method}:${path}`] = handler;
  }

  public get(path: string, handler: Handler) {
    const routePath = this._parseRoute(path);
    this.addRoute(HttpMethod.GET, routePath, handler);
  }

  public post(path: string, handler: Handler) {
    this.addRoute(HttpMethod.POST, path, handler);
  }

  public listen(port: number, callback: () => void) {
    const server = net.createServer((socket) => {
      let dataBuffer = "";

      socket.on("data", (chunk) => {
        dataBuffer += chunk.toString();
      });

      socket.on("end", () => {
        const request = parseHttpRequest(dataBuffer.toString());

        let parsedBody: string;

        request.body = request.body || "";

        if (request.headers["Content-Type"] === "application/json") {
          try {
            request.body = JSON.parse(request.body as string);
            parsedBody = JSON.stringify(request.body);
          } catch {
            request.body = {};
            parsedBody = "{}";
          }
        } else if (
          request.headers["Content-Type"] ===
          "application/x-www-form-urlencoded"
        ) {
          request.body = request.body
            ? parseFormData(request.body as string)
            : {};
          parsedBody = request.body ? JSON.stringify(request.body) : "{}";
        } else {
          parsedBody = request.body as string;
        }

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
          send: (body: any) => {
            let responseBody: string;

            // Determine the response type
            if (typeof body === "object") {
              responseBody = JSON.stringify(body); // Serialize object to JSON
              socket.end(
                createHttpResponse(
                  200,
                  "OK",
                  { "Content-Type": "application/json" },
                  responseBody
                )
              );
            } else if (typeof body === "string") {
              responseBody = body; // Use string as-is
              socket.end(createHttpResponse(200, "OK", {}, responseBody));
            } else {
              // Handle other types gracefully
              responseBody = String(body);
              socket.end(createHttpResponse(200, "OK", {}, responseBody));
            }
          },
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
          handler({ ...request, parsedBody }, res);
        } catch (error) {
          const errorResponse = createHttpResponse(
            500,
            error?.message,
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
