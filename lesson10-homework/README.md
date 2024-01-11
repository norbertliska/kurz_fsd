# Popis

Cachovanie requestov cez REDIS

Latencia generovania obsahu sa simuluje cez setTimeout, vid .env -> DB_LATENCY


# Inštalácia balíčkou
```
npm i
```

# docker
```
docker-compose.yml

docker-compose up
```

# Spustenie (automatický reload)

```
nodemon
```

# Testovanie v browseri

## Cachovanie textu

http://localhost:3000/text/1

Odpoved trva DB_LATENCY milisekund, obsah sa cachuje **10** sekund

Ak sa odpoved generuje akoze z DB, pridal som casovy udaj, aby volo lepsie vidiet ci sa jedna o novy obsah alebo o cachovany.


## Cachovanie JSON

http://localhost:3000/json/1

Odpoved trva DB_LATENCY milisekund, obsah sa cachuje **15** sekund

Ak sa odpoved generuje akoze z DB, pridal som casovy udaj, aby volo lepsie vidiet ci sa jedna o novy obsah alebo o cachovany.




