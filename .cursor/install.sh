#!/usr/bin/env bash
# Awam-Stock Cloud Agent 安装脚本：幂等地准备依赖与本地数据库
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

MONGO_HOME="$HOME/.awamstock/mongo"
MONGO_DATA="$MONGO_HOME/data"

log() { echo "[install] $*"; }

# 确保系统级依赖存在（快照基础镜像通常已包含，缺失时兜底安装）
ensure_system_deps() {
  if ! command -v python >/dev/null 2>&1; then
    log "安装 python-is-python3"
    sudo apt-get update -y
    sudo apt-get install -y python-is-python3 python3-pip
  fi

  if ! command -v mongod >/dev/null 2>&1; then
    log "安装 MongoDB 8.0"
    curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc |
      sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor --yes
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" |
      sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
    sudo apt-get update -y
    sudo apt-get install -y mongodb-org
  fi
}

# 安装 Node 依赖并构建 TS 子包（前端不在此构建）
install_node() {
  log "pnpm install"
  pnpm install --frozen-lockfile
  log "构建 shared/model/db/server"
  pnpm build
}

# 安装 akshare/aktools 本地数据服务的 Python 依赖
install_python() {
  log "安装 akshare/aktools Python 依赖"
  pip install --break-system-packages -r packages/akshare/requirements.txt
}

# 初始化本地 MongoDB：创建数据目录与 root 用户（与 shared 默认配置一致）
init_mongo() {
  mkdir -p "$MONGO_DATA"
  if [ -f "$MONGO_DATA/.awamstock-initialized" ]; then
    log "MongoDB 已初始化，跳过"
    return
  fi
  # 已在运行（例如开发机手动启动）则视为已初始化
  if mongosh --quiet --port 27017 --eval 'db.runCommand({ ping: 1 })' >/dev/null 2>&1; then
    log "MongoDB 已在运行，标记为已初始化"
    touch "$MONGO_DATA/.awamstock-initialized"
    return
  fi

  log "初始化 MongoDB root 用户"
  mongod --dbpath "$MONGO_DATA" --port 27017 --bind_ip 127.0.0.1 \
    --logpath "$MONGO_HOME/init.log" --fork
  for _ in $(seq 1 30); do
    mongosh --quiet --port 27017 --eval 'db.runCommand({ ping: 1 })' >/dev/null 2>&1 && break
    sleep 1
  done
  mongosh --quiet --port 27017 <<'EOF'
const admin = db.getSiblingDB('admin');
if (!admin.getUser('root')) {
  admin.createUser({ user: 'root', pwd: '123456', roles: [{ role: 'root', db: 'admin' }] });
  print('created root user');
} else {
  print('root user already exists');
}
EOF
  mongod --dbpath "$MONGO_DATA" --shutdown
  touch "$MONGO_DATA/.awamstock-initialized"
}

ensure_system_deps
install_node
install_python
init_mongo

log "完成"
