#!/bin/bash

set -e

set -u

function create_user_and_database() {
	local database=$1
	echo "Creating database '$database'"
	psql --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
		CREATE DATABASE $database;
	EOSQL
}

if [ -n "$INIT_DB_LIST" ]; then
	echo "Multiple database creation requested: $INIT_DB_LIST"
	for db in $(echo $INIT_DB_LIST | tr ',' ' '); do
		create_user_and_database $db
	done
	echo "Multiple databases created"
fi

exec "$@"