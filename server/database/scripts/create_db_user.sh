#!/bin/bash
set -euo pipefail

db_user="mariadbuser"
db_passwd="mariadbuser"
db_name="TecnoComponentes_BD"
db_ipaddr="localhost"

read -s -p "Enter MariaDB root password: " passwd
echo # TODO: consider ~/.my.cnf to store passwords

mariadb -u root --password="$passwd" -v -e "
  CREATE DATABASE IF NOT EXISTS \`${db_name}\`;
  DROP USER IF EXISTS '${db_user}'@'${db_ipaddr}';
  CREATE USER '${db_user}'@'${db_ipaddr}' IDENTIFIED BY '${db_passwd}';
  GRANT SELECT,INSERT,UPDATE,DELETE,EXECUTE ON \`${db_name}\`.* TO '${db_user}'@'${db_ipaddr}';
  FLUSH PRIVILEGES;
"

