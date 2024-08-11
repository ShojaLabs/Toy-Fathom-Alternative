docker compose down &&
  rm -rf stacks/db_data &&
  mkdir stacks/db_data &&
  docker compose --env-file .env.production build &&
  docker compose --env-file .env.production up -d
