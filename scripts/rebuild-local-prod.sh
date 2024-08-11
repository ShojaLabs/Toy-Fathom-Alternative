docker compose -f docker/prod/docker-compose.yml down &&
  # rm -rf ./stacks/prod_db_data &&
  # mkdir ./stacks/prod_db_data &&
  docker compose -f docker/prod/docker-compose.yml --env-file .env build &&
  docker compose -f docker/prod/docker-compose.yml --env-file .env up -d
