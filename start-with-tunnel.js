const localtunnel = require('localtunnel');
const fs = require('fs');
const { exec, spawn } = require('child_process');

(async () => {
  const tunnel = await localtunnel({ port: 3000 });

  console.log(`Tunnel is running at: ${tunnel.url}`);

  // Write the URL to the .env file
  fs.writeFileSync('.env', `TUNNEL_URL="${tunnel.url}/leads"`);
  console.log('URL written to .env file');

  // Start the main application
  const child = exec('npm run build && node --env-file=.env dist/index.js');
 
  child.stdout.on('data', (data) => {
    console.log(data.toString());
  });

  child.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  tunnel.on('close', () => {
    console.log('Tunnel is closed');
    child.kill();
  });
})();