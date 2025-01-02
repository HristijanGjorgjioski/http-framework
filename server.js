const net = require("net");

function parseHttpRequest(data) {
  const [headerPart, body] = data.split("\r\n\r\n");
  const [requestLine, ...headerLines] = headerPart.split("\r\n");

  const [method, fullPath, httpVersion] = requestLine.split(" ");
  const [path, queryString] = fullPath.split("?");

  const headers = {};
  headerLines.forEach((line) => {
    const [key, value] = line.split(": ");
    headers[key.toLowerCase()] = value;
  });

  const query = queryString
    ? Object.fromEntries(new URLSearchParams(queryString))
    : {};

  return { method, path, httpVersion, headers, body, query };
}

function createHttpResponse(statusCode, statusMessage, headers, body) {
  headers["Content-Length"] = Buffer.byteLength(body, "utf-8");

  let response = `HTTP/1.1 ${statusCode} ${statusMessage}\r\n`;

  for (const [key, value] of Object.entries(headers)) {
    response += `${key}: ${value}\r\n`;
  }

  response += `\r\n`;
  response += body;
  return response;
}

const routes = {
  "/": () =>
    createHttpResponse(
      200,
      "OK",
      { "Content-Type": "text/plain" },
      "Hristijan greets you! Home Page!"
    ),
  "/guest": (req) => {
    const name = req?.query?.name || "Guest";

    return createHttpResponse(
      201,
      "OK",
      { "Content-Type": "text/plain" },
      `${name} Pagee!`
    );
  },
  "/create-file": (req) => {
    if (req.method === "POST") {
      return createHttpResponse(
        201,
        "Created",
        { "Content-Type": "application/json" },
        "File Created"
      );
    } else {
      return createHttpResponse(
        405,
        "Method Not Allowed",
        { "Content-Type": "text/plain" },
        "Only POST is allowed on this endpoint."
      );
    }
  },
};

const server = net.createServer((socket) => {
  console.log("Client connected!");

  socket.on("data", (data) => {
    const request = parseHttpRequest(data.toString());
    console.log("Received data: ", request);

    const handler =
      routes[request.path] ||
      (() =>
        createHttpResponse(
          404,
          "Not Found",
          { "Content-Type": "text/plain" },
          "Page Not Found. Please go homeee!"
        ));

    const response = handler(request);
    socket.write(response);
    socket.end();
  });

  socket.on("end", () => {
    console.log("Client disconnected!");
  });
});

server.listen(2002, () => {
  console.log("Server running on port 2002");
});
