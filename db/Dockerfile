FROM mariadb:10.4

LABEL dev="Lippielip -> https://github.com/lippielip"
LABEL ops="Pitscher -> https://github.com/pitscher"
LABEL description = "The database of the Colloquium Selector Robot"
LABEL version ="0.1"

COPY csr_db.sql ./docker-entrypoint-initdb.d

EXPOSE 3306