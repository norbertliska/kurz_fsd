import express, { Request, Response } from 'express';
import { IFileStorage } from "../FileStorage.mjs";


/**
 * akoze zadavat meno v URL sa mi nie prilis pozdava, ale ako cvicenie hadam bude OK
 * [out] HTTP 200 <binary-content>
 * [out] HTTP 412 { error: "..." }
 */
export function createHandler(storage: IFileStorage) {
    const router = express.Router()

    router.get('/:filename', async (req: Request, res: Response) => {
        try {
            const filename = req.params.filename;
            const data = await storage.download(filename);
            if (filename.indexOf(".") >= 0) res.type(filename); // Pre istotu. Ak je filename bez extension, tak proste ziadny ContentType a browser otvori download-okno
            res.send(data);    
        }
        catch (e) {
            res.status(412);
            res.json({ error: e.toString() })
        }
    });

    return router
}
