import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envFile = resolve(__dirname, "..", "env", ".env");

dotenv.config({ path: envFile });
