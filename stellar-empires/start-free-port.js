// start-free-port.js
import detect from 'detect-port';
import { spawn } from 'child_process';

const DEFAULT_PORT = 3000;

detect(DEFAULT_PORT).then(port => {
  if (port === DEFAULT_PORT) {
    console.log(`Starting dev server on port ${DEFAULT_PORT}...`);
    spawn('npm', ['run', 'react-start'], { stdio: 'inherit', shell: true });
  } else {
    console.log(`Port ${DEFAULT_PORT} is taken. Starting on port ${port}...`);
    // Pass PORT to child process environment
    spawn('npm', ['run', 'react-start'], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, PORT: port },
    });
  }
});
