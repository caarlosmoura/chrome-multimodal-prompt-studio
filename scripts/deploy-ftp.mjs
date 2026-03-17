import { access } from 'node:fs/promises';
import path from 'node:path';
import { Client } from 'basic-ftp';

const requiredEnv = ['FTP_HOST', 'FTP_USER', 'FTP_PASSWORD'];
const missing = requiredEnv.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const localDist = path.resolve(process.cwd(), 'dist');
const remoteDir = process.env.FTP_REMOTE_DIR || '/';
const client = new Client();

try {
  await access(localDist);

  await client.access({
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASSWORD,
    secure: process.env.FTP_SECURE === 'true',
  });

  await client.ensureDir(remoteDir);
  await client.clearWorkingDir();
  await client.uploadFromDir(localDist);

  console.log(`FTP deploy completed to ${process.env.FTP_HOST}${remoteDir}`);
} catch (error) {
  console.error(`FTP deploy failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  client.close();
}
