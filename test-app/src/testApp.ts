import { Server } from "kiko-js";

const server = new Server();

server.get("/me", (req, res) => {
  res.send("I am Kik1o");
});

server.post("/kiko-post", (req, res) => {
  console.log(req, "req");
  const body = { message: "kiko", status: 200 };
  res.send(body);
});

server.listen(2002, () => {
  console.log("Kiko is listening on port 2002");
});
