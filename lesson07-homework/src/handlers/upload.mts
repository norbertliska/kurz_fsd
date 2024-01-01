import express, { Request, Response } from 'express';
import fileUpload, { UploadedFile } from "express-fileupload"

import { FileStorage } from "../FileStorage.mjs";

/** 
 * Upload per multipart/form-data
 * 
 * @param {FileStorage} storage
 * [in] POST /files     (name musí byť "file")
 *      Content-Type: multipart/form-data; 
 *      ...
 *      --boundaryXXX
 *      Content-Disposition: form-data; name="file"; filename="molekuly.jpg"
 *  
 * [out] HTTP 200 <empty>
 * [out] HTTP 412 { error: string } 
 * @returns
 */
export function createHandler(storage: FileStorage) {
    const router = express.Router()

    router.post("/", [fileUpload()], async (req: Request, res: Response) => {
        let file: UploadedFile = null;

        try {
            // ked je filename="" , tak aj pri puhom pozreti na "req.files.file" hadze exception...
            file = req.files.file as UploadedFile;
        }
        catch (e) {
            res.status(412);
            res.json({ error: "Nenasiel sa subor... " });
            return;
        }

        // ak je "name" != "image", tak je "req.files.image" undefined, ale hore nehodi exception...
        if (file === void 0 || file === null) {
            res.status(412);
            res.json({ error: "Nenasiel sa subor..." });
            return;
        }

        try {
            await storage.upload(file.name, file.data);
        }
        catch (e) {
            res.status(412);
            res.json({ error: e.toString() })
            return;
        }

        res.status(200);
        res.send("");
    });

    return router
}


