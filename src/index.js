import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    }
  }
};

export default config;