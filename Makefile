.PHONY: start-dev
start-dev:
	docker compose -f docker/dev/docker-compose.yml --env-file .env build && docker compose -f docker/dev/docker-compose.yml --env-file .env up -d

.PHONY: stop-dev
stop-dev:
	docker compose -f docker/dev/docker-compose.yml --env-file .env down

.PHONY: local-prod-up
local-prod-up:
	./scripts/rebuild-local-prod.sh

.PHONY: local-prod-down
local-prod-down:
	docker compose -f docker/local-prod/docker-compose.yml --env-file .env down

.PHONY: build-prod
build-prod:
	docker compose -f docker/prod/docker-compose.yml --env-file .env.production build

.PHONY: start-prod
start-prod:
	docker compose -f docker/prod/docker-compose.yml --env-file .env.production up -d

.PHONY: stop-prod
stop-prod:
	docker compose -f docker/prod/docker-compose.yml --env-file .env.production down
