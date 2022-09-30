const redis = require("redis");
// const client = redis.createClient();
const Redis = require("ioredis");
// const client = redis.createClient(6379, "3.85.164.141");
// client.connect();
 let client = new Redis(
   "rediss://:1b20295202064b1697c39dbfa009cdc7@us1-adapting-oarfish-38309.upstash.io:38309"
 );
rediss://:1b20295202064b1697c39dbfa009cdc7@us1-adapting-oarfish-38309.upstash.io:38309
//let client = new Redis("redis://13.115.187.17:6379");
client
  .connect()
  .then(() => {})
  .catch((error) => {
    console.log(error);
  });
client.on("connect", function () {
  console.log("Connected!");
});
module.exports = { client };
