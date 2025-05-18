const { spawn } = require("child_process");
const path = require("path");

const isDev = process.argv.some(arg =>
  ["--dev", "-d", "dev", "development"].includes(arg)
);

// Function to run a command in a separate process
function runCommand(command, args, options = {}) {
  const proc = spawn(command, args, {
    stdio: "inherit",
    shell: true,
    detached: true,
    ...options,
  });
  return proc;
}

if (isDev) {
  console.log("Starting DeerFlow in [DEVELOPMENT] mode...\n");

  // 启动后端服务（开发模式，含 searxng）
  const backend = runCommand("uv", [
    "run", "server.py", "--reload", "--host", "0.0.0.0", "--port", "8000"
  ]);

  // 在后端服务内启动 searxng
  const searxngScript = path.join(__dirname, "src", "tools", "start-searxng.sh");
  const searxngProcess = runCommand("bash", [searxngScript]);

  // 启动前端开发服务
  const frontend = runCommand("pnpm", ["--dir", "web", "dev"]);

  // 关闭所有进程
  const shutdown = () => {
    backend.kill("SIGINT");
    searxngProcess.kill("SIGINT");
    frontend.kill("SIGINT");
    process.exit();
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

} else {
  console.log("Starting DeerFlow in [PRODUCTION] mode...\n");

  // 启动后端服务（生产模式，含 searxng）
  const backend = runCommand("uv", [
    "run", "server.py",
    "--host", "0.0.0.0",
    "--port", "8000",
<<<<<<< HEAD
=======
    //SSL证书参数传入
>>>>>>> edc086a4d5e58380f5c1c8636b6719dfc1212438
    //"--ssl-keyfile", "/www/wwwroot/deer-flow/web/privkey.pem",
    //"--ssl-certfile", "/www/wwwroot/deer-flow/web/fullchain.pem"
  ]);

  // 在后端服务内启动 searxng
  const searxngScript = path.join(__dirname, "src", "tools", "start-searxng.sh");
  const searxngProcess = runCommand("bash", [searxngScript]);

  // 启动前端生产服务
  const frontend = runCommand("pnpm", ["--dir", "web", "start"]);

  // 关闭所有进程
  const shutdown = () => {
    backend.kill("SIGINT");
    searxngProcess.kill("SIGINT");
    frontend.kill("SIGINT");
    process.exit();
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
