#!/bin/bash

source environment.sh

echo "Luodaan tietokantataulut..."

ssh users.cs "
cd $PROJECT_FOLDER/sql
cat drop_tables.sql create_tables.sql | psql -1 -f -
exit"

echo "Valmis!"
