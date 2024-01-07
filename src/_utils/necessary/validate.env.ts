import { cleanEnv, port, str } from "envalid";

export default function validateEnv(): void {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ["development", "production"],
    }),
    PORT: port({ default: 5000 }),
    CORE_DATABASE_URL: str(),
    JWT_SECRET_KEY: str(),
  });
}
