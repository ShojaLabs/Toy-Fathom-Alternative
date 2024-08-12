docker compose -f docker/local-prod/docker-compose.yml --env-file .env down &&
  rm -rf ./stacks/prod_db_data &&
  mkdir ./stacks/prod_db_data &&
  docker compose -f docker/local-prod/docker-compose.yml --env-file .env build --no-cache &&
  docker compose -f docker/local-prod/docker-compose.yml --env-file .env up -d &&
  docker compose -f docker/local-prod/docker-compose.yml logs --follow
