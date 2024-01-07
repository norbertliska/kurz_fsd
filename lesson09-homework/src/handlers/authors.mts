import express, { Request, Response } from 'express';
import { IDataStorage } from "../db/IDataStorage.js"
import { IPayload, authMiddleware } from "./auth.mjs"

const generError = (res: Response, msg: string) => {
    res.status(401);
    res.send({ error: msg });
}

export function createHandler(dataStorage: IDataStorage) {
    const router = express.Router()

    /**
     * GET /  -> vsetci autori
     */
    router.get('/', async (req, res) => {
        try {
            const authors = await dataStorage.getAuthors();
            res.json(authors);
        }
        catch (e: any) {
            generError(res, e.message)
            return;
        }
    })

    /**
     * GET /:id  -> jeden autor
     */
    router.get('/:id', async (req, res) => {
        try {
            const authorId = parseInt(req.params.id || "", 10);
            if (isNaN(authorId)) {
                res.status(404);
                res.send("");
                return;
            }

            const author = await dataStorage.getAuthor(authorId);
            if (author === null) {
                res.status(404);
                res.send("");
                return;
            }
            res.json(author);
        }
        catch (e: any) {
            generError(res, e.message)
            return;
        }
    })

    /**
     * POST /  -> create author
     * [in] Authorization: Bearer {{token}}
     * [in] { name:"Jozko mrkvicka", job:"sofer", "login": "jm", password: "jmpwd"}
     * [out] HTTP 200 { author_id:number }
     * [out] HTTP 401 { error: string }
     */
    router.post('/', authMiddleware, async (req, res) => {
        const payload = (req as any).payload as IPayload;

        // ušetríme si jeden call do DB
        if (!payload.is_admin) {
            generError(res, "Treba byt prihlaseny ako administrator!");
            return;
        }

        let authorId = 0;
        try {
            authorId = await dataStorage.addAuthorUnique({
                id: 0,
                name: req.body.name,
                job: req.body.job
            })

            const userId = await dataStorage.addUserUnique({
                id: 0,
                login: req.body.login,
                password: req.body.password,
                author_id: authorId,
                is_admin: false
            })

            res.json({ author_id: authorId });

        }
        catch (e: any) {

            if (authorId !== 0) {
                try {
                    await dataStorage.deleteAuthorAndDeps(authorId);
                }
                catch (e2) { }
            }

            generError(res, e.message)
            return;
        }
    })

    /**
     * PATCH /:id  ->update autora
     * [in] Authorization: Bearer {{token}}
     * [in] { "id":"{{authorId}}", "job":"sofer#2", "name":"Jozko Ikarus#2" }
     * [out] HTTP 401 { error: string }
     */
    router.patch("/:id", authMiddleware, async (req, res) => {
        try {
            const authorId = parseInt(req.params.id || "0", 10);
            if (isNaN(authorId)) {
                generError(res, "Nerozpoznane id autora");
                return;
            }

            const payload = (req as any).payload as IPayload;

            if (authorId !== payload.author_id && !payload.is_admin) {
                generError(res, "Updatovat autora moze len on sam alebo administrator.")
                return;
            }

            let prms:any = {
                id: authorId
            }
            if (req.body.job !== void 0) prms.job = req.body.job;
            if (req.body.name !== void 0) prms.name = req.body.name;

            await dataStorage.updateAuthor(prms);

            res.send("")
        }
        catch (e:any) {
            generError(res, e.message)
            return;
        }    
    });


    /**
     * DELETE /:id   -> delete autora
     * [in] Authorization: Bearer {{token}}
     * [out] HTTP 401 { error: string }
     */
    router.delete("/:id", authMiddleware, async (req, res) => {
        try {
            const authorId = parseInt(req.params.id || "0", 10);
            if (isNaN(authorId)) {
                generError(res, "Nerozpoznane id autora");
                return;
            }

            const payload = (req as any).payload as IPayload;
            if (!payload.is_admin) {
                generError(res, "Zmazat autora moze len administrator.")
                return;
            }

            await dataStorage.deleteAuthorAndDeps(authorId);

            res.send("")
        }
        catch (e:any) {
            generError(res, e.message)
            return;
        }    
    });

    return router
}
