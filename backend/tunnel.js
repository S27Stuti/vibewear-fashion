const { spawn } = require('child_process');

function startTunnel() {
  console.log('[Tunnel] Launching persistent localtunnel on port 5000...');
  const proc = spawn('npx', ['--yes', 'localtunnel', '--port', '5000'], { shell: true });

  proc.stdout.on('data', (d) => {
    const text = d.toString().trim();
    if (text) {
      console.log(text);
    }
  });

  proc.stderr.on('data', (d) => {
    const text = d.toString().trim();
    if (text) {
      console.error('[Tunnel Error]:', text);
    }
  });

  proc.on('close', (code) => {
    console.log(`[Tunnel] Exited with code ${code}. Reconnecting in 3 seconds...`);
    setTimeout(startTunnel, 3000);
  });
}

startTunnel();
