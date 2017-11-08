#!/bin/bash

source environment.sh

echo "Lisätään testidata..."

ssh users.cs "
cd $PROJECT_FOLDER/sql
psql < add_test_data.sql
exit"

echo "Valmis!"
