#!/bin/bash
set -euo pipefail

db_name="TecnoComponentes_BD"
script_dir=$(dirname "$0")

read -s -p "Enter MariaDB root password: " passwd
echo # TODO: consider ~/.my.cnf to store passwords

mariadb -u root --password="$passwd" -v -e "
    DROP DATABASE IF EXISTS \`${db_name}\`;
    CREATE DATABASE \`${db_name}\`;
" && echo

mariadb -u root --password="$passwd" "$db_name" < "${script_dir}/db_tables.sql"

