
# Co to robi
CRUD operace pro články i autory.

Niekde treba autentifikaciu, niekde nie.

IDataStorage je čisto na ukladanie dát, implementácia nie je ničím limitovaná. Ako príklad je použitý Postgre&kysely.


# Inštalácia balíčkou
```
npm i
```


# Postgre
```
[.env]
DATABASE_URL="postgresql://norofox:<PASSWORD>@ep-lucky-smoke-28104758.eu-central-1.aws.neon.tech/<DATABASE_NAME>?sslmode=require"

```


# SQL a testovacie dáta
```
schema_and_data.sql
```


# Spustenie (automatický reload)

```
nodemon
```


# Príklady
```
test.http
```


