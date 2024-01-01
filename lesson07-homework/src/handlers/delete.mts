import { Request, Response } from 'express';
import { FileStorage } from "../FileStorage.mjs";

export async function handler(
    req: Request,
    res: Response,
    next: () => void,
    storage: FileStorage,
    fileName: string
) {
    try {
        await storage.delete(fileName);
        res.send("");
    }
    catch (e) {
        res.status(412);
        res.json({ error: e.toString() })
    }
}


