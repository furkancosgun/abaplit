import { spawn, execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('📦 Building project (npm run build)...');
try {
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
} catch (err) {
  console.error('❌ Build failed.');
  process.exit(1);
}

console.log('\n🚀 Starting abap2fiori Backend and Fiori Frontend...\n');

// 1. Start Backend Server
const backend = spawn('node', ['scripts/server.mjs'], {
  cwd: rootDir,
  stdio: 'inherit',
  env: { ...process.env, PORT: '3000' }
});

// 2. Start Fiori Frontend Tooling
const fiori = spawn('npx', ['ui5', 'serve', '--config', 'app/ui5.yaml', '--open', '/index.html'], {
  cwd: rootDir,
  stdio: 'inherit'
});

const cleanup = () => {
  console.log('\n🛑 Stopping servers...');
  backend.kill('SIGINT');
  fiori.kill('SIGINT');
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

backend.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`Backend process exited with code ${code}`);
    cleanup();
  }
});

fiori.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`Fiori UI5 process exited with code ${code}`);
    cleanup();
  }
});
