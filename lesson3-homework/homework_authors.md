## GET /authors
- zoznam autorov
- Chcelo by to aj pagination&co - ukazem pri /articles

### HTTP 200
```
[
    {
        id:1,
        name:"Jozko Mrkvicka",
        job: "zahradnik",
        banned: false
    },
    {
        id:2,
        name:"Janko Hrasko",
        job: "student",
        banned: false
    },
    {
        id:3,
        name:"Filomena Tajomna",
        job: "na materskej",
        banned: false
    },
    ...
]
```

## GET /authors/{id}
- Detail autora

### HTTP 200
```
{
    id:2,
    name:"Janko Hrasko",
    job: "student",
    banned: false
}
```
### HTTP 404
```
{
    error: "AUTHOR_NOT_FOUND"
    message: "Author {id} was not found."
}
```

## POST /authors
- Vytvorenie autora
- "banned" je automaticky false
```
{
    name:"Zaneta Pokorna",
    job: "eskort",
}
```
### HTTP 200
```
{
    id: 4,
    name:"Zaneta Pokorna",
    job: "eskort",
    banned: false
}
```

### HTTP 412
```
{
    error: "Dany user uz existuje",
    code: 123456    
}

alebo 

{
    error: "Meno autora musi byt medzi 2 a 50 znakmi",
    code: 789012
}
```


## PATCH /authors/{id}
- Update autora
```
{    
    banned: true
}
```

### HTTP 201

### HTTP 404
```
{
    error: "AUTHOR_NOT_FOUND"
    message: "Author {id} was not found."
}
```

## DELETE /authors/{id}

- Zmazanie autora vratane clankov

### HTTP 201

### HTTP 404
```
{
    error: "AUTHOR_NOT_FOUND"
    message: "Author {id} was not found."
}
```


