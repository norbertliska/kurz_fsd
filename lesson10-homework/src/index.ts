import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { createMiddleware as createCacheMiddleware } from './simpleWebCache.mjs'

dotenv.config();
const DB_LATENCY = parseInt(process.env.DB_LATENCY || "2000", 10);

const app = express();

/**
 * trvá DB_LATENCY ms
 */
async function simulDBTextContentLatency(url: string, ttl: number): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, DB_LATENCY));
    return `"${url}": Textovy content generovany o ${(new Date()).toLocaleTimeString("sk-SK")}, TTL=${ttl}`;
}

/**
 * trvá DB_LATENCY ms
 */
async function simulDBJsonContentLatency(url: string, ttl: number): Promise<object> {
    await new Promise(resolve => setTimeout(resolve, DB_LATENCY));
    return {
        url: url,
        time: (new Date()).toLocaleTimeString("sk-SK"),
        ttl: ttl
    }
}

// jeden endpoint na testovanie textovaho contentu, TTL=10
app.get("/text/:id", createCacheMiddleware(10), async (req: Request, res: Response) => {
    res.send(await simulDBTextContentLatency(req.url, 10));
});

// jeden endpoint na testovanie JSON contentu, TTL=15
app.get("/json/:id", createCacheMiddleware(15), async (req: Request, res: Response) => {
    res.send(await simulDBJsonContentLatency(req.url, 15));
});


/**
 * http server
 */
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
const host = process.env.HOST ?? "127.0.0.1"

app.listen(port, host, () => {
    console.log(`Server listening on http://${host}:${port}`)
})




