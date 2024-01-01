import { Request, Response } from 'express';
import { FileStorage } from "../FileStorage.mjs";


/**
 * [out] HTTP 200 <binary-content>
 * [out] HTTP 412 { error: "..." }
 */
export async function handler(
    req: Request,
    res: Response,
    next: () => void,
    storage: FileStorage,
    fileName: string
) {
    try {
        const data = await storage.download(fileName);
        if (fileName.indexOf(".") >= 0) res.type(fileName); // Pre istotu. Ak je filename bez extension, tak proste ziadny ContentType a browser otvori download-okno
        res.send(data);
    }
    catch (e) {
        res.status(412);
        res.json({ error: e.toString() })
    }
}