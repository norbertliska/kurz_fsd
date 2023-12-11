



## GET /articles/{id}
- Detail jedného článku se vším všudy

### HTTP 200
```
{
    id: 12345,
    publicationDatetime:"2023-01-01T10:20:30"
    author: {
        id: 3,
        name: "Filomena Tajomna"
    },               
    category: {
        id: 101,
        name: "Zdravie"
    }
    title:"Ako schudnut do plaviek",
    uvod: "Leto je coskoro tu a desite sa vyzliect na plazi? Mozno este nie je neskoro",
    contentHtml:".... treba <h1>cvicit.....</b>"
    contentPlain: "..... treba cvicit....",
    tags: [ "chudnutie", "leto", "plavky", "tozvladnes"]
}
```


## POST /articles
- vytvorenie článku
- **authorId** nesmie byť zabanovaný
- **categoryId** musí existovať
- **title** od 5 do 50 znakov
- **uvod** od 5 do 100 znakov
- **contentHtml** od 100 do 10000 znakov
- **contentPlain** sa parsne na serveri z **contentHtml**
- **tags** max 20, dĺžka jedného max 30 znakov
- **publicationDatetime** sa setne na serveri automaticky

```
{
    authorId:3,
    categoryId:101,
    title: "Ako schudnut do plaviek",
    uvod: "Leto je coskoro tu a desite sa vyzliect na plazi? Mozno este nie je neskoro",
    contentHtml:".... treba <h1>cvicit.....</b>"    
    tags: [ "chudnutie", "leto", "plavky", "tozvladnes"]
}
```

### HTTP 200
```
ako GET /articles/{id}
```

### HTTP 412
```
{
    error: "Dany author {id} neexistuje",
    code: 123456    
}

alebo 

{
    error: "Nadpis musí byť od 5 do 50 zankov",
    code: 789012
}
```


## GET /articles?page=3&perPage=25
- **Nefiltrovaný** zoznam článkov
- Sortovaný od najnovšieho
- Vhodné pre pagination
- Pole itemov ako *"GET /articles/{id}"* ale **bez contentHtml/contentPlain** (šetríme traffic)
- **page**: 1-based
- **perPage**: Max 1000

### HTTP 200
```
[
    {
        id: 12345,
        publicationDatetime:"2023-01-01T10:20:30"
        author: {
            id: 3,
            name: "Filomena Tajomna"
        },               
        category: {
            id: 101,
            name: "Zdravie"
        }
        title:"Ako schudnut do plaviek",
        uvod: "Leto je coskoro tu a desite sa vyzliect na plazi? Mozno este nie je neskoro",
        tags: [ "chudnutie", "leto", "plavky", "tozvladnes"]
    },
    ...
]
```


## GET /articles?afterId=1234&limit=20
- **Nefiltrovaný** zoznam článkov
- Sortovaný od najnovšieho
- Vhodné pre infinite scrolling
- **afterId**: V prvom dotaze 0, v nasledujúcich *posledne_id_v_predchadzajuom_dotaze*
- Ak sa vráti nula itemov, sme na konci
- **limit**: Max 1000

### HTTP 200
```
Ako "GET /articles?page=3&perPage=25"
```


## GET /articles?authorId=2&page=3&perPage=25
- Zoznam autorových článkov
- Sortovaný od najnovšieho
- Vhodné pre pagination
- **page**: 1-based
- **perPage**: Max 1000

### HTTP 200
```
Ako "GET /articles?page=3&perPage=25"s
```

### HTTP 404
```
{
    error: "AUTHOR_NOT_FOUND"
    message: "Author {id} was not found."
}
```


## GET /articles?authorId=2&afterId=1234&limit=20
- Zoznam autorových článkov
- Sortovaný od najnovšieho
- Vhodné pre infinite scrolling
- Finta s **afterId** ako pri *"GET /articles?afterId=1234&limit=20"*
- **limit**: Max 1000

### HTTP 200
```
Ako "GET /articles?page=3&perPage=25"s
```

### HTTP 404
```
{
    error: "AUTHOR_NOT_FOUND"
    message: "Author {id} was not found."
}
```


## GET /articles?categoryId=101&page=3&perPage=25
- Zoznam článkov danej kategórie
- Sortovaný od najnovšieho
- Vhodné pre pagination
- **page**: 1-based
- **perPage**: Max 1000

### HTTP 200
```
Ako "GET /articles?page=3&perPage=25"
```

### HTTP 404
```
{
    error: "CATEGORY_NOT_FOUND"
    message: "Category {id} was not found."
}
```


## GET /articles?categoryId=101&afterId=1234&limit=20
- Zoznam článkov danej kategórie
- Sortovaný od najnovšieho
- Vhodné pre infinite scrolling
- **limit**: Max 1000
- Finta s **afterId** ako pri *"GET /articles?afterId=1234&limit=20"*



## POST /articles/filter
- Zoznam článkov podľa **advanced filtra**
- Na všetky podmienky sa aplikuje logické AND
- **authorIds**: zoznam autorov.. Ak je undefined alebo null -> ignore sa
- **categoryIds**: zoznam kategorii.. Ak je undefined alebo null -> ignore sa
- **titleContains**: Titulok obsahuje... Ak je undefined alebo null alebo "" -> ignoruje sa
- **contentContains**: Content obsahuje... Ak je undefined alebo null alebo  "" -> ignoruje sa
- **tags**: Ak undefined alebo null alebo length = 0 -> ignoruje sa. Ak je ich v poli viac, tak clanok musi obsahovat aspon jeden z nich
- **publishedFrom**, **publishedTo**: ak je undefined alebo null alebo "" -> ignoruje sa
- **page**: 1-based
- **perPage**: Max 1000

```
{
    [optional] authorIds:int[], // trochu uletené, ale budiš
    [optional] categoryIds: int[],
    [optional] titleContains: string,
    [optional] contentContains: string, // search celý content
    [optional] tags: string[],
    [optional] publishedFrom,
    [optional] publishedTo,
    page:int,
    perPage: int
}
```

### HTTP 200
```
Ako "GET /articles?page=3&perPage=25"s
```

### HTTP 412
```
{
    error: "Invalid value for parameter {xxx}. The value {yyy} cannot be converted into type {zzz}",
    code: 123456    
}
```


## DELETE /articles/{id}

- Zmazanie článku

### HTTP 200
Dohoda, ze ak aj uz v DB neexistuje, tak nebudeme stresovat s errorom





