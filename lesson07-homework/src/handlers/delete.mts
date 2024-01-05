import express, { Request, Response } from 'express';
import { IFileStorage } from "../FileStorage.mjs";

/**
 * akoze zadavat meno v URL sa mi nie prilis pozdava, ale ako cvicenie hadam bude OK
 * [out] HTTP 200 <binary-content>
 * [out] HTTP 412 { error: "..." }
 */
export function createHandler(storage: IFileStorage) {
    const router = express.Router()

    router.delete('/:filename', async (req: Request, res: Response) => {
        try {
            const filename = req.params.filename;
            await storage.delete(filename);
            res.send("");
        }
        catch (e) {
            res.status(412);
            res.json({ error: e.toString() })
        }
    });

    return router
}
