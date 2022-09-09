// const redis = require("redis");
// const client = redis.createClient();
const Redis = require("ioredis");

let client = new Redis(process.env.REDIS_URL);
client.on("connect", function () {
  console.log("Connected!");
});
module.exports = { client };
