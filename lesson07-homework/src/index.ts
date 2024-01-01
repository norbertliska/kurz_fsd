import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

import { driverFactory } from './DriverFactory.mjs'
import { FileStorage } from "./FileStorage.mjs";

import { createHandler as createListHandler } from "./handlers/list.mjs"
import { createHandler as createUploadHandler } from "./handlers/upload.mjs"
import { handler as deleteHandler } from "./handlers/delete.mjs"
import { handler as downloadHandler } from "./handlers/download.mjs"

dotenv.config();

let storage: FileStorage = null;
try {
    storage = await new FileStorage(await driverFactory.createByDotenv());
}
catch (e) {
    console.log(`Error: ${e}`);
    process.exit(1);
}

/* testovaci kodik ci funguje await/async spravne
console.log("###list BEGIN ###");
try {
    var lst = await storage.list();
    console.log( JSON.stringify(lst) );
}
catch(e:any) {
    console.log(`Error: ${e}`)
};
console.log("###list END ###");
*/

const app = express();

app.use(express.urlencoded({ extended: true }))

app.get('/', async (_req: Request, res: Response) => {
    res.send('Hello World!');
});

// upload
app.use('/files', createUploadHandler(storage));

// download: akoze zadavat meno v URL sa mi nie prilis pozdava, ale ako cvicenie hadam bude OK
app.get("/files/:filename", async (req: Request, res: Response, next: () => void) => {
    await downloadHandler(req, res, next, storage, req.params.filename)
});

// delete
app.use("/files/:filename", async (req: Request, res: Response, next: () => void) => {
    await deleteHandler(req, res, next, storage, req.params.filename);
});

// list
app.use('/files', createListHandler(storage));


/**
 * http server
 */
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
const host = process.env.HOST ?? "127.0.0.1"

app.listen(port, host, () => {
    console.log(`Server listening on http://${host}:${port}`)
})




