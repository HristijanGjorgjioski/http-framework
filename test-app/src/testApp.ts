import { Server } from "http-framework";

const server = new Server();

server.get("/me", (req, res) => {
  res.send("I am Kiko");
});

server.listen(2002, () => {
  console.log("Kiko is listening on port 2002");
});
