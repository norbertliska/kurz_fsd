# Pouzitie

Info: CURL je pod windows, takze pre mac/linux treba napasovat uvodzovky&co...


## login/create JWT
Vytvorenie tokenu

```
curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d "{\"username\":\"user2\",\"password\":\"pwd2\"}"

Vrati:
{"id":2,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6WyJtYW5hZ2VyIiwidmlld191c2VyX3Byb2ZpbGUiXSwidXNlcm5hbWUiOiJ1c2VyMiIsImlhdCI6MTcwMjI4OTI0MiwiZXhwIjoxNzAyMjkyODQyfQ.eu4epYNzgdHLNrINb_aUnJWvx8qX5ZNNKuSW5-M1Mms"}

```


## test JWT
Svoj profil - payload info

```
curl -X POST http://localhost:3000/profile -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6WyJtYW5hZ2VyIiwidmlld191c2VyX3Byb2ZpbGUiXSwidXNlcm5hbWUiOiJ1c2VyMiIsImlhdCI6MTcwMjI4OTI0MiwiZXhwIjoxNzAyMjkyODQyfQ.eu4epYNzgdHLNrINb_aUnJWvx8qX5ZNNKuSW5-M1Mms"

Vrati: {"id":2,"username":"user2","role":["manager","view_user_profile"]}
```

Svoj profil - full info
```
curl -X POST http://localhost:3000/profile?full -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6WyJtYW5hZ2VyIiwidmlld191c2VyX3Byb2ZpbGUiXSwidXNlcm5hbWUiOiJ1c2VyMiIsImlhdCI6MTcwMjI4OTI0MiwiZXhwIjoxNzAyMjkyODQyfQ.eu4epYNzgdHLNrINb_aUnJWvx8qX5ZNNKuSW5-M1Mms"

Vrati: {"id":2,"username":"user2","role":["manager","view_user_profile"],"fullName":"User2 User2","address":"EU"}
```

Zobrazenie profilu ineho usera:
```
curl -X POST http://localhost:3000/user/3/profile -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6WyJtYW5hZ2VyIiwidmlld191c2VyX3Byb2ZpbGUiXSwidXNlcm5hbWUiOiJ1c2VyMiIsImlhdCI6MTcwMjI4OTI0MiwiZXhwIjoxNzAyMjkyODQyfQ.eu4epYNzgdHLNrINb_aUnJWvx8qX5ZNNKuSW5-M1Mms"

Vrati: {"id":3,"username":"user3","role":["veduci zajazdu"]}
```


## endpoint bez auth.
```
curl http://localhost:3000/categories
```