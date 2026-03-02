import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const TASKS_FILE = path.join(rootDir, 'data', 'ai-tasks.json');
const CLAUDE_BIN = '/home/plg/.nvm/versions/node/v20.19.4/bin/claude';
const POLL_INTERVAL = 5000;
const TASK_TIMEOUT = 300000;

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

async function readTasks() {
  try {
    const raw = await fs.readFile(TASKS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeTasks(tasks) {
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');
}

function runClaude(prompt) {
  return new Promise((resolve, reject) => {
    const env = { ...process.env };
    delete env.CLAUDECODE;
    let stdout = '';
    let stderr = '';
    const proc = spawn(
      CLAUDE_BIN,
      ['-p', prompt, '--max-turns', '5', '--dangerously-skip-permissions'],
      { cwd: rootDir, env, stdio: ['pipe', 'pipe', 'pipe'] }
    );
    proc.stdin.end();
    proc.stdout.on('data', (d) => { stdout += d; });
    proc.stderr.on('data', (d) => { stderr += d; log(`stderr: ${d.toString().trim()}`); });

    const timer = setTimeout(() => {
      proc.kill('SIGTERM');
      setTimeout(() => proc.kill('SIGKILL'), 5000);
      reject(new Error('Таймаут: задача выполнялась дольше 5 минут'));
    }, TASK_TIMEOUT);

    proc.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(stderr || `Процесс завершился с кодом ${code}`));
      }
    });
    proc.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

async function poll() {
  try {
    const tasks = await readTasks();
    const pending = tasks.find((t) => t.status === 'pending');
    if (!pending) return;

    log(`Starting task ${pending.id}: ${pending.prompt.slice(0, 80)}...`);

    pending.status = 'running';
    pending.started_at = new Date().toISOString();
    await writeTasks(tasks);

    try {
      const result = await runClaude(pending.prompt);
      // Re-read to avoid overwriting concurrent changes
      const fresh = await readTasks();
      const task = fresh.find((t) => t.id === pending.id);
      if (task) {
        task.status = 'done';
        task.result = result.trim();
        task.finished_at = new Date().toISOString();
        await writeTasks(fresh);
      }
      log(`Task ${pending.id} done (${task ? task.result.length : 0} chars)`);
    } catch (err) {
      const fresh = await readTasks();
      const task = fresh.find((t) => t.id === pending.id);
      if (task) {
        task.status = 'error';
        task.result = err.message;
        task.finished_at = new Date().toISOString();
        await writeTasks(fresh);
      }
      log(`Task ${pending.id} error: ${err.message}`);
    }
  } catch (err) {
    log(`Poll error: ${err.message}`);
  }
}

log('AI Worker started');
setInterval(poll, POLL_INTERVAL);
poll();
