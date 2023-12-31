import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

import { driverFactory } from './DriverFactory.mjs'
import { FileStorage } from "./FileStorage.mjs";

import { createHandler as createListHandler } from "./handlers/list.mjs"
import { createHandler as createUploadHandler } from "./handlers/upload.mjs"
import { createHandler as createDeleteHandler } from "./handlers/delete.mjs"
import { createHandler as createDownloadHandler } from "./handlers/download.mjs"

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

// download
app.use('/files', createDownloadHandler(storage));

// delete
app.use('/files', createDeleteHandler(storage));

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




