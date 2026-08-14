#!/usr/bin/env bash
# Awam-Stock Cloud Agent 启动脚本：每次开机拉起本地 MongoDB 守护进程
set -euo pipefail

MONGO_HOME="$HOME/.awamstock/mongo"
MONGO_DATA="$MONGO_HOME/data"

log() { echo "[start] $*"; }

mkdir -p "$MONGO_DATA"

# 已在运行则直接返回，避免重复启动
if mongosh --quiet --port 27017 --eval 'db.runCommand({ ping: 1 })' >/dev/null 2>&1; then
  log "MongoDB 已在运行"
  exit 0
fi

# 清理可能残留的锁文件后以鉴权模式后台启动
rm -f "$MONGO_DATA/mongod.lock"
log "启动 MongoDB (auth)"
mongod --dbpath "$MONGO_DATA" --port 27017 --bind_ip 127.0.0.1 --auth \
  --logpath "$MONGO_HOME/mongod.log" --fork

# 等待就绪
for _ in $(seq 1 30); do
  if mongosh --quiet "mongodb://root:123456@127.0.0.1:27017/admin?authSource=admin" \
    --eval 'db.runCommand({ ping: 1 })' >/dev/null 2>&1; then
    log "MongoDB 就绪 (mongodb://127.0.0.1:27017)"
    exit 0
  fi
  sleep 1
done

log "MongoDB 启动超时，请检查 $MONGO_HOME/mongod.log"
exit 1
