const path = require('path');
const fs = require('fs');
const { Client } = require('pg');

const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.error('Файл .env не найден');
  process.exit(1);
}

const env = fs.readFileSync(envPath, 'utf8');
let databaseUrl = process.env.DATABASE_URL;
for (const line of env.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('DATABASE_URL=')) {
    databaseUrl = trimmed
      .slice('DATABASE_URL='.length)
      .trim()
      .replace(/^["']|["']$/g, '');
    break;
  }
}
if (!databaseUrl) {
  console.error('DATABASE_URL не задан в .env');
  process.exit(1);
}

const migrationsDir = path.join(__dirname, '..', 'migrations');
if (!fs.existsSync(migrationsDir)) {
  console.error('Папка migrations не найдена');
  process.exit(1);
}

const singleFile = process.argv[2];
const files = singleFile
  ? [singleFile]
  : fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

if (files.length === 0) {
  console.error(singleFile ? 'Миграция не найдена:' : 'Нет файлов миграций в migrations/');
  if (singleFile) console.error(singleFile);
  process.exit(1);
}

async function run() {
  const client = new Client({ connectionString: databaseUrl });
  try {
    await client.connect();
    for (const file of files) {
      const migrationPath = path.join(migrationsDir, file);
      if (!fs.existsSync(migrationPath)) {
        console.error('Файл не найден:', migrationPath);
        process.exit(1);
      }
      const sql = fs.readFileSync(migrationPath, 'utf8');
      console.log('Применяю:', file);
      await client.query(sql);
    }
    console.log('Готово. Применено миграций:', files.length);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
