import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { IDataStorage } from "./db/IDataStorage.js"
import { DataStorageKysely, IDataStorageKyselyOpenConfig } from "./db/DataStorageKysely.js";

import { createHandler as createAuthHandler } from "./handlers/auth.mjs";
import { createHandler as createAuthorsHandler } from "./handlers/authors.mjs";
import { createHandler as createArticlesHandler } from "./handlers/articles.mjs";

dotenv.config();

const app = express();
app.use(express.json());

let dataStorage: IDataStorage;

try {
    dataStorage = new DataStorageKysely();
    dataStorage.open(<IDataStorageKyselyOpenConfig>{ connectionString: process.env.DATABASE_URL });
}
catch (e) {
    console.log(e);
    process.exit(1);
}

app.use(express.urlencoded({ extended: true }))

app.get('/', async (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.use("/login", createAuthHandler(dataStorage));
app.use("/authors", createAuthorsHandler(dataStorage));
app.use("/articles", createArticlesHandler(dataStorage));


/**
 * http server
 */
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
const host = process.env.HOST ?? "127.0.0.1"

app.listen(port, host, () => {
    console.log(`Server listening on http://${host}:${port}`)
})




