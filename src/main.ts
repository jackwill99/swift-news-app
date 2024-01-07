import * as DotEnv from "dotenv";
import validateEnv from "./_utils/necessary/validate.env";
import applicationSwaggerConfig from "./app.api.swagger";
import { ClusterService } from "./app.cluster.service";
import applicationConfig from "./app.config";

async function application() {
  /**
   * Config and Validate of env
   */
  DotEnv.config({ path: __dirname + "/.env" });
  validateEnv();

  const app = await applicationConfig();

  await applicationSwaggerConfig(app);

  await app.listen(process.env["PORT"]!, "0.0.0.0");

  console.log("App is running at " + (await app.getUrl()));
}

ClusterService.clusterize(application);
