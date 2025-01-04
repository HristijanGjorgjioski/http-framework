import { Server } from "kiko-js";

const server = new Server();

server.get("/me", (req, res) => {
  res.send("I am Kik1o");
});

server.listen(2002, () => {
  console.log("Kiko is listening on port 2002");
});
