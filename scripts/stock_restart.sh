#!/usr/bin/env bash
# stock_restart — 在 awam-stock-public 项目根目录重启 PM2 生产进程
# 用法:
#   stock_restart           # 跳过构建，按包 startOrReload
#   stock_restart --build   # 先构建再启动（走 pnpm pm2:start）
set -euo pipefail

APP_ROOT="${STOCK_APP_ROOT:-/opt/code/awam-stock-public}"
AWST_ENV="${AWST_ENV:-tx}"

if [[ ! -d "$APP_ROOT" ]]; then
  echo "[stock_restart] 项目目录不存在: $APP_ROOT" >&2
  exit 1
fi
if [[ ! -f "$APP_ROOT/package.json" ]]; then
  echo "[stock_restart] 不是有效项目根目录（缺少 package.json）: $APP_ROOT" >&2
  exit 1
fi

# 非登录 shell 也要能找到 nvm 的 node/pnpm/pm2
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [[ -s "$NVM_DIR/nvm.sh" ]]; then
  # shellcheck disable=SC1090
  . "$NVM_DIR/nvm.sh"
fi
# 优先当前 nvm 默认 node；否则回退到已知版本路径
if [[ -d "$NVM_DIR/versions/node" ]]; then
  _node_bin="$(ls -d "$NVM_DIR"/versions/node/v*/bin 2>/dev/null | sort -V | tail -1 || true)"
  if [[ -n "${_node_bin:-}" ]]; then
    export PATH="$_node_bin:$PATH"
  fi
fi
export PATH="/usr/local/bin:$PATH"

if ! command -v pm2 >/dev/null 2>&1; then
  echo "[stock_restart] 未找到 pm2" >&2
  exit 1
fi

cd "$APP_ROOT"
export AWST_ENV
export NODE_ENV="${NODE_ENV:-production}"

echo "[stock_restart] cwd=$(pwd)"
echo "[stock_restart] AWST_ENV=$AWST_ENV user=$(whoami) pm2=$(command -v pm2)"

do_build=0
for arg in "$@"; do
  case "$arg" in
    --build) do_build=1 ;;
    -h|--help)
      echo "用法: stock_restart [--build]"
      echo "  默认按包 startOrReload（不跑 pip/install）"
      echo "  加 --build 则走 pnpm pm2:start（含构建）"
      echo "  项目目录可用 STOCK_APP_ROOT 覆盖（默认 $APP_ROOT）"
      exit 0
      ;;
    *)
      echo "[stock_restart] 未知参数: $arg" >&2
      exit 1
      ;;
  esac
done

mkdir -p /var/log/stock-akshare /var/log/stock-db /var/log/stock-server

if [[ "$do_build" -eq 1 ]]; then
  if ! command -v pnpm >/dev/null 2>&1; then
    echo "[stock_restart] 未找到 pnpm" >&2
    exit 1
  fi
  pnpm pm2:start
else
  # 各包必须在自身目录执行，ecosystem 里 cwd 为相对 './'
  reload_one() {
    local dir="$1"
    local name="$2"
    local eco="$APP_ROOT/$dir/ecosystem.config.js"
    if [[ ! -f "$eco" ]]; then
      echo "[stock_restart] 跳过 $name：缺少 $eco" >&2
      return 1
    fi
    echo "[stock_restart] reload $name (cwd=$APP_ROOT/$dir)"
    (
      cd "$APP_ROOT/$dir"
      pm2 startOrReload ecosystem.config.js --only "$name"
    )
  }

  # akshare 依赖 python，失败不阻断 db/server
  set +e
  reload_one packages/akshare stock-akshare
  akshare_rc=$?
  set -e

  reload_one packages/db stock-db
  reload_one packages/server stock-server

  if [[ "$akshare_rc" -ne 0 ]]; then
    echo "[stock_restart] 警告: stock-akshare 启动失败（常见原因: 缺 python/pip），db/server 已继续" >&2
  fi
fi

echo
pm2 ls
echo "[stock_restart] 完成"
