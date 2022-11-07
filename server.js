const app = require("./app");
// require("./redis");
const port = process.env.PORT || 5500;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// console.log("process.env.REDIS_URL", process.env.REDIS_URL);
