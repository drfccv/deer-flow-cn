const { spawn } = require("child_process");
const path = require("path");

const isDev = process.argv.some(arg =>
  ["--dev", "-d", "dev", "development"].includes(arg)
);

// 在独立进程中运行命令的函数
function runCommand(command, args, options = {}) {
  const proc = spawn(command, args, {
    stdio: "inherit",  // 使输出在终端中可见
    shell: true,
    detached: true,    // 确保进程在后台运行
    ...options,
  });
  return proc;
}

if (isDev) {
  console.log("Starting DeerFlow in [DEVELOPMENT] mode...\n");

  // 启动后端服务（开发模式，含 --reload）
  const backend = runCommand("uv", [
    "run", "server.py", "--reload", "--host", "0.0.0.0", "--port", "8000"
  ]);

  // 启动前端开发服务
  const frontend = runCommand("pnpm", ["--dir", "web", "dev"]);

  // 处理 SIGINT 和 SIGTERM 信号以终止所有进程
  const shutdown = () => {
    backend.kill("SIGINT");
    frontend.kill("SIGINT");
    process.exit();
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

} else {
  console.log("Starting DeerFlow in [PRODUCTION] mode...\n");

  // 启动后端服务（生产模式，支持 SSL）
  const backend = runCommand("uv", [
    "run", "server.py", 
    "--host", "0.0.0.0", 
    "--port", "8000", 
    // SSL证书参数传入（如需启用SSL请取消下面两行注释）
    //"--ssl-keyfile", "/www/wwwroot/deer-flow/web/privkey.pem", 
    //"--ssl-certfile", "/www/wwwroot/deer-flow/web/fullchain.pem"
  ]);

  // 启动前端生产服务
  const frontend = runCommand("pnpm", ["--dir", "web", "start"]);

  // 处理 SIGINT 和 SIGTERM 信号以终止所有进程
  const shutdown = () => {
    backend.kill("SIGINT");
    frontend.kill("SIGINT");
    process.exit();
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
