import { Server } from "kiko-js";

const server = new Server();

const multiply = () => {
  console.log("This function will multiply two numbers");

  return 20 / 4;
};

const sum = multiply();

server.get("/me", (req, res) => {
  res.send("I am Kik1o");
});

server.post("/kiko-post", (req, res) => {
  console.log(req, "req");
  const body = { message: "kiko", status: 200 };
  res.send(body);
});

server.listen(2002, () => {
  console.log(`Kiko is listening on port 2002 == ${sum}`);
});
