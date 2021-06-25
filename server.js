const app = require("./app");
const serverPort = 23235

app.listen(serverPort, () => {
  console.log(`Server started on port ${serverPort}`);
});