import homepage from "./index.html";

const server = Bun.serve({
  port: 0,
  routes: {
    "/": homepage,
  },
});

console.log(`Listening on ${server.url}`);

export default server;
