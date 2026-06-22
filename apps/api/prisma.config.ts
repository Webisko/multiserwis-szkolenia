import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'prisma/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '.env');

if (!process.env.DATABASE_URL && fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (!key) continue;
    const value = rest.join('=').trim().replace(/^"|"$/g, '');
    if (key === 'DATABASE_URL' && value) {
      process.env.DATABASE_URL = value;
      break;
    }
  }
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'prisma db execute --file prisma/seed.sql',
  },
  datasource: {
    url: process.env.DATABASE_URL ?? '',
  },
});
