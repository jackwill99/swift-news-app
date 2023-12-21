import * as DotEnv from "dotenv";
import validateEnv from "./_utils/necessary/validate.env";
import applicationSwaggerConfig from "./app.api.swagger";
import applicationConfig from "./app.config";

async function application() {
  /**
   * Config and Validate of env
   */
  DotEnv.config({ path: __dirname + "/.env" });
  validateEnv();

  const app = await applicationConfig();

  if (process.env["NODE_ENV"] === "development") {
    await applicationSwaggerConfig(app);
  }

  await app.listen(process.env["PORT"]!, "0.0.0.0");

  if (process.env["NODE_ENV"] === "development") {
    console.log("App is running at " + (await app.getUrl()));
  }
}

application();
