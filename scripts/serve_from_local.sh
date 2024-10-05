while true; do
  ssh -p 443 -R0:localhost:3000 -L4300:localhost:4300 -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -t vbTlHBkLZFt@eu.a.pinggy.io x:https x:passpreflight
  sleep 10
done
