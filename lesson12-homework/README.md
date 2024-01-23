
# Postup pre mna

## docker build appku

docker build -t lesson12-homework-app:latest -f Dockerfile-app .

writing image sha256:f148ba4054790855a51e9b956f55762891fb5d23f8ab79c97c37bb83d2e92446
naming to docker.io/library/lesson12-homework-app:latest         


## testovacie spustenie mojej appky

docker run --env PORT=3000 --env HOST=0.0.0.0 -p 3000:3000 lesson12-homework-app:latest

http://localhost:3000/ -> 1ef98f89b85e: 7:08:16 PM
















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




