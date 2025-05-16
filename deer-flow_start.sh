PATH=/www/server/nodejs/v22.15.0/bin:/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

export 
export NODE_PROJECT_NAME="deer-flow"
cd /www/wwwroot/deer-flow
nohup /www/server/nodejs/v22.15.0/bin/node /www/wwwroot/deer-flow/server.py  &>> /www/wwwlogs/nodejs/deer-flow.log &
echo $! > /www/server/nodejs/vhost/pids/deer-flow.pid
