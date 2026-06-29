#!/bin/sh
# Diagnostic only. Prints what the frontend container can see about the backend
# at startup, so we can tell whether the timeout is DNS, IP family, or reachability.

echo "==================== [debug-backend] ===================="
echo "[debug-backend] BACKEND_URL=${BACKEND_URL:-<UNSET>}"
echo "[debug-backend] NGINX_LOCAL_RESOLVERS=${NGINX_LOCAL_RESOLVERS:-<UNSET>}"
echo "[debug-backend] /etc/resolv.conf:"
sed 's/^/    /' /etc/resolv.conf 2>&1

url="${BACKEND_URL:-}"
hostport="${url#*://}"
hostport="${hostport%%/*}"
host="${hostport%%:*}"
port="${hostport##*:}"
[ "$port" = "$host" ] && port=80
echo "[debug-backend] parsed host=$host port=$port"

echo "[debug-backend] nslookup $host:"
nslookup "$host" 2>&1 | sed 's/^/    /'

echo "[debug-backend] connectivity probe (3 tries, 5s timeout each):"
i=1
while [ "$i" -le 3 ]; do
  echo "  --- try $i ---"
  wget -S -T 5 -O /dev/null "${url%/}/api-docs" 2>&1 | sed 's/^/    /'
  echo "    wget exit=$?"
  i=$((i + 1))
  sleep 2
done
echo "==================== [/debug-backend] ===================="
exit 0
