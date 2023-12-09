# BLOG API


## homework_authors.md
```
GET /authors
GET /authors/{id}
POST /authors
PATCH /authors/{id}
DELETE /authors/{id}
```

## homework_categories.md
```
GET /categories
```
*(POST/PATCH/DELETE&co. by boli ako pre authors)*


## homework_articles.md
```
GET /articles/{id}
GET /articles?page=3&perPage=25
GET /articles?afterId=1234&limit=20
GET /articles?authorId=2&page=3&perPage=25
GET /articles?authorId=2&afterId=1234&limit=20
GET /articles?categoryId=101&page=3&perPage=25
GET /articles?categoryId=101&afterId=1234&limit=20
POST /articles/filter
```


## Zdroje
```
db.author {
    id:int,
    name:string,
    job: string,
    banned: bool // true=nas*al admina   
}

db.category {
    id:int,
    name:string,
    examples:string
}

db.blog {
    id:int,
    publicationDatetime:datetime,
    authorId:int,
    categoryId:int,
    title:string,
    contentHtml:string
    contentPlain:string
    tags: string[]
}
```
