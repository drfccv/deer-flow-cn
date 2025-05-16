const { spawn } = require("child_process");
const path = require("path");

const isDev = process.argv.some(arg =>
  ["--dev", "-d", "dev", "development"].includes(arg)
);

// Function to run a command in a separate process
function runCommand(command, args, options = {}) {
  const proc = spawn(command, args, {
    stdio: "inherit",  // This makes the output visible in the terminal
    shell: true,
    detached: true,    // Ensures the process runs in the background
    ...options,
  });
  return proc;
}

if (isDev) {
  console.log("Starting DeerFlow in [DEVELOPMENT] mode...\n");

  // Start backend in development mode (with --reload)
  const backend = runCommand("/www/server/pyporject_evn/versions/3.13.1/bin/uv", [
    "run", "server.py", "--reload", "--host", "0.0.0.0", "--port", "8000"
  ]);

  // Start frontend development server
  const frontend = runCommand("pnpm", ["--dir", "web", "dev"]);

  // Handle SIGINT and SIGTERM to terminate both processes
  const shutdown = () => {
    backend.kill("SIGINT");
    frontend.kill("SIGINT");
    process.exit();
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

} else {
  console.log("Starting DeerFlow in [PRODUCTION] mode...\n");

  // Start backend in production mode with SSL
  const backend = runCommand("/www/server/pyporject_evn/versions/3.13.1/bin/uv", [
    "run", "server.py", 
    "--host", "0.0.0.0", 
    "--port", "8000", 
    "--ssl-keyfile", "/www/wwwroot/deer-flow/web/privkey.pem", 
    "--ssl-certfile", "/www/wwwroot/deer-flow/web/fullchain.pem"
  ]);

  // Start frontend production server in background
  const frontend = runCommand("pnpm", ["--dir", "web", "start"]);

  // Handle SIGINT and SIGTERM to terminate both processes
  const shutdown = () => {
    backend.kill("SIGINT");
    frontend.kill("SIGINT");
    process.exit();
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
