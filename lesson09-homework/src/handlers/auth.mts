import express, { Request, Response } from 'express';
import pkg from "jsonwebtoken"
const { sign, verify } = pkg;

import { IDataStorage } from "../db/IDataStorage.js"

const SECRET_KEY = "B9B46EAF-1839-40E6-95C6-9C2ED09F2D8D";

export interface IPayload {
    user_id: number;
    author_id: number;
    is_admin: boolean;
}

export function createHandler(dataStorage: IDataStorage) {
    const router = express.Router()

    /**
     * POST /   -> login
     * [in] { username:"xxx", password: "yyy"}
     * [out] HTTP 200 { payload: IPayLoad, token:string }
     * [out] HTTP 401 { error: string }
     */
    router.post('/', async (req, res) => {        
        const username = req.body.username;
        const password = req.body.password;
        try {
            const u = await dataStorage.findUserByLoginAndPassword(username, password);
            const payload: IPayload = {
                user_id: u.id,
                author_id: u.author_id,
                is_admin: u.is_admin
            }
            const token = sign(payload, SECRET_KEY, { expiresIn: "1h" })
            res.send({ token: token, payload: payload })
        }
        catch(e:any){
            res.status(401);
            res.send({ error: e.message })
        }
    })

    return router
}

/**
 * Middleware
 * [in]  header: Authorization: Bearer <jwttoken>
 * [out] ak OK -> setne req.payload = IPayload
 * [out] ak problem -> 401 a { error:string, detail:string }
 */
export const authMiddleware = (req:Request, res:Response, next:() => void):void => {
    let authHeader = req.headers?.authorization;

    const generError = (detail:string) => {
        res.status(401);
        res.send( { error: "Žiadna alebo chybná authentifikácia", detail: detail });    
    }

    if (authHeader == void 0) { generError("Chýba authentifikacny header"); return; }

    // ideme vyparsovat token, cize z "bearer xxx" -> "xxx"
    const parts = authHeader.trim().split(" ");
    if (parts.length !== 2) { generError("Auth. header musí byť vo formáte \"Bearer<space><token>\""); return; }
    if (parts[0].toLowerCase() !== "bearer")  { generError("Auth. header musí byť vo formáte \"Bearer<space><token>\""); return; }
    
    try {
        const payload = verify(parts[1], SECRET_KEY) as IPayload;
        (req as any).payload = payload; // TADAAA!!!
        next();    
    }
    catch(e) {
         generError("Neprešlo jwt.verify: " + e); 
         return; 
    }
}
