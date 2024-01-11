import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { createMiddleware as createCacheMiddleware } from './simpleWebCache.mjs'

dotenv.config();
const DB_LATENCY = parseInt(process.env.DB_LATENCY || "2000", 10);

const app = express();

/**
 * trvá DB_LATENCY ms
 */
async function simulDBTextContentLatency(): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, DB_LATENCY));
    return `Nejaky textovy content..`;
}

/**
 * trvá DB_LATENCY ms
 */
async function simulDBJsonContentLatency(): Promise<object> {
    await new Promise(resolve => setTimeout(resolve, DB_LATENCY));
    return {
        content: `Nejaky content..`
    };
}

// jeden endpoint na testovanie textovaho contentu, TTL=10
app.get("/text/:id", createCacheMiddleware(10), async (req: Request, res: Response) => {
    let text = await simulDBTextContentLatency();
    text +=     
        `<br>Generovany pre "${req.url}" o ${(new Date()).toLocaleTimeString("sk-SK")}` +
        `<br>TTL=10}`;        
    res.send(text);
});

// jeden endpoint na testovanie JSON contentu, TTL=15
app.get("/json/:id", createCacheMiddleware(15), async (req: Request, res: Response) => {
    let json:any = await simulDBJsonContentLatency();
    json.url = req.url;
    json.time = (new Date()).toLocaleTimeString("sk-SK");
    json.ttl = 15;
    res.send(json);
});

/**
 * http server
 */
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
const host = process.env.HOST ?? "127.0.0.1"

app.listen(port, host, () => {
    console.log(`Server listening on http://${host}:${port}`)
})

