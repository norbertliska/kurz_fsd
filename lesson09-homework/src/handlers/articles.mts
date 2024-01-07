import express, { Request, Response } from 'express';
import { IDataStorage, IGetArticlesPrms } from "../db/IDataStorage.js"
import { IPayload, authMiddleware } from "./auth.mjs"

const generError = (res: Response, msg: string) => {
    res.status(401);
    res.send({ error: msg });
}

export function createHandler(dataStorage: IDataStorage) {
    const router = express.Router()

    /**
     * POST /  -> create article
     * [in] Authorization: Bearer {{token}}
     * [in] { "author_id":"17", "category_id":"2", "title":"Nove BMW X5", "uvod": "Uz ste ho videli?", "content_plain": "content pre Nove BMW X5", "tags":["bmw","x5","new"]}
     * [out] HTTP 200 { article_id:number }
     * [out] HTTP 401 { error: string }
     */
    router.post('/', authMiddleware, async (req, res) => {
        const payload = (req as any).payload as IPayload;

        // ušetríme si jeden call do DB
        if (payload.author_id === 0) {
            generError(res, "Nie je priradeny ziadny autor.");
            return;
        }

        try {
            const articleId = await dataStorage.addArticle({
                author_id: payload.author_id,
                category_id: req.body.category_id,
                title: req.body.title,
                uvod: req.body.uvod,
                content_plain: req.body.content_plain,
                tags: req.body.tags
            })

            res.json({article_id: articleId });
        }
        catch (e:any) {
            generError(res, e.message)
            return;
        }
    })

    /**
     * GET /<articleId>  -> jeden clanok so vsetkymi informaciami
     * ziadna authentifikacia
     */
    router.get("/:id", async (req, res) => {
        try {
            const articleId = parseInt(req.params.id, 10);
            if (isNaN(articleId)) {
                generError(res, "Nerozpoznane cislo clanku");
                return;
            }
            var article = await dataStorage.getArticle(articleId);
            if (article === null) {
                res.status(404);
                res.send("");
                return;
            }

            res.json(article);
        }
        catch (e:any) {
            generError(res, e.message)
            return;
        }    
    });

    /**
     * GET /   -> zoznam clankov, natvrdo paging
     * [url] page: defaul 1
     * [url] perPage: default 10
     * [ulr] authorId: optional
     * ziadna authentifikacia
     */
    router.get("/", async (req, res) => {
        try {

            let filter:IGetArticlesPrms = {
                page: parseInt(req.query["page"] as string || "1", 10),
                perPage: parseInt(req.query["perPage"] as string || "10", 10),
                authorId: parseInt(req.query["authorId"] as string || "0", 10),
            };
            
            const articles = await dataStorage.getArticles(filter);

            res.json(articles);
        }
        catch (e:any) {
            generError(res, e.message)
            return;
        }    
    });

    /**
     * PATCH /:id   -> update article
     * [in] Authorization: Bearer {{token}}
     * [in] "category_id":"999", "title":"Nove BMW X5#2", "uvod":"Uz ste ho videli?#2", "content_plain":"content pre Nove BMW X5#2", "tags":["bmw","x5","new","#2"]
     */
    router.patch("/:id", authMiddleware, async (req, res) => {
        try {
            const articleId = parseInt(req.params.id, 10);
            if (isNaN(articleId)) {
                generError(res, "Nerozpoznane cislo clanku");
                return;
            }

            const payload = (req as any).payload as IPayload;

            var article = await dataStorage.getArticle(articleId);
            if (article === null) {
                generError(res, `Clanok s id "${articleId}" neexistuje`);
                return;
            }

            if (article.author_id !== payload.author_id && !payload.is_admin){
                generError(res, "Tento clanok moze updatovat len autor alebo administrator!")
                return;
            }

            let prms:any = {
                id: articleId
            }
            if (req.body.category_id !== void 0) prms.category_id = req.body.category_id;
            if (req.body.title !== void 0) prms.title = req.body.title;
            if (req.body.uvod !== void 0) prms.uvod = req.body.uvod;
            if (req.body.content_plain !== void 0) prms.content_plain = req.body.content_plain;
            if (req.body.tags !== void 0) prms.tags = req.body.tags;

            console.log(prms);

            await dataStorage.updateArticle(prms);

            res.send("")
        }
        catch (e:any) {
            generError(res, e.message)
            return;
        }    
    });


    /**
     * DELETE /:id   -> delete article
     * [in] Authorization: Bearer {{token}}
     */
    router.delete("/:id", authMiddleware, async (req, res) => {
        try {
            const articleId = parseInt(req.params.id || "0", 10);
            if (isNaN(articleId)) {
                generError(res, "Nerozpoznane cislo clanku");
                return;
            }

            const payload = (req as any).payload as IPayload;
            var article = await dataStorage.getArticle(articleId);
            if (article === null) {
                res.send(""); // ked nie je, tak nie je...
                return;
            }

            if (article.author_id !== payload.author_id && !payload.is_admin) {
                generError(res, "Tento clanok moze deletnut len autor alebo admin!")
                return;
            }

            await dataStorage.deleteArticle(articleId);

            res.send("")
        }
        catch (e:any) {
            generError(res, e.message)
            return;
        }    
    });


    //
    return router
}
