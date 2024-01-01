import express, { Request, Response } from 'express';
import { FileStorage } from "../FileStorage.mjs";

/** 
 * @param {FileStorage} storage
 * @returns
 */
export function createHandler(storage: FileStorage) {
    const router = express.Router()

    router.get('/', async (_req: Request, res: Response) => {
        try {
            var lst = await storage.list();
            res.json(lst);
        }
        catch (e) {
            res.status(412);
            res.json({ error: e.toString() })
        }
    });

    return router
}


