import serverConfig from "../config/server";
import app from "./app";

app.listen(serverConfig.port, () => {
  console.log(`Server listening in port ${serverConfig.port}`);
});
