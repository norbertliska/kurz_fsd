import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { sign as jwt_sign, verify as jwt_verify } from "jsonwebtoken"
import * as bodyParser from "body-parser"
import fileUpload from "express-fileupload"

import { userService }  from './UserService'
import { ImageRepositoryService  } from './ImageRepositoryService'
import { UploadedFile } from 'express-fileupload';

const SECRET_KEY = "B9B46EAF-1839-40E6-95C6-9C2ED09F2D8D";
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
const host = process.env.HOST ?? "127.0.0.1"

interface IPayload {
    id: number;
    username: string;
}

dotenv.config();

const irs = new ImageRepositoryService("public/upload");

const app = express()
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(fileUpload({ useTempFiles: true}))
app.use(express.static('public'))

/**
 *  GET /
 */
app.get('/', (_req: Request, res: Response) => {
    res.send("Hello world!");
});

/**
 * POST /login
 * [in] { username:"xxx", password: "yyy"}
 * [out] HTTP 200 { id:number, token:string }
 * [out] HTTP 401 { error: string }
 */
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const u = userService.getByNameAndPassword( username, password )
    if (u) {
        const payload:IPayload = {
            id: u.id,
            username: u.username
        }            
        const token = jwt_sign(payload, SECRET_KEY, {expiresIn: "1h"})
        res.send({ id: u.id, token: token})
    }
    else {
        res.status(401);
        res.send({error:"Zlé meno alebo heslo"})
    }
});


/**
 * Middleware
 * [in]  header: Authorization: Bearer <jwttoken>
 * [out] ak OK -> setne req.payload = payload
 * [out] ak problem -> 401 a { error:string, detail:string }
 */
const authMiddleware = (req:Request, res:Response, next:() => void):void => {
    let authHeader = req.headers?.authorization

    const generError = (detail:string) => {
        res.status(401); // podla doku je 401 vhodnejsia ako 403
        res.send( { error: "Žiadna alebo chybná authentifikácia", detail: detail });    
    }

    if (authHeader == void 0) { generError("Chýba authentifikacny header"); return; }

    // ideme vyparsovat token, cize z "bearer xxx" -> "xxx"
    const parts = authHeader.trim().split(" ");
    if (parts.length !== 2) { generError("Auth. header musí byť vo formáte \"Bearer<space><token>\""); return; }
    if (parts[0].toLowerCase() !== "bearer")  { generError("Auth. header musí byť vo formáte \"Bearer<space><token>\""); return; }
    
    try {
        const payload = <IPayload>jwt_verify(parts[1], SECRET_KEY);
        (<any>req).payload = payload; // TADAAA!!!
        next();    
    }
    catch(e) {
         generError("Neprešlo jwt.verify: " + e); 
         return; 
    }
}

/**
 * Upload per multipart/form-data
 * [in] POST /upload     (name musí byť "image")
 *      Authorization: Bearer <jwt-token>
 *      Content-Type: multipart/form-data; 
 *      ...
 *      --boundaryXXX
 *      Content-Disposition: form-data; name="image"; filename="molekuly.jpg"
 *  
 * [out] HTTP 200 { path: string, thumbnailPath?: string }
 * [out] HTTP 412 { error: string }
 * [out] vid authMiddleware
 */
app.post("/upload", [authMiddleware], async (req:Request, res:Response) => {        
    const payload = <IPayload>((<any>req).payload);

    let file:UploadedFile = null;
    
    try {
        // ked je filename="" , tak aj pri puhom pozreti na  "req.files.image" hadze exception...
        file = <UploadedFile>(req.files.image);   
    }
    catch(e) {
        res.status(412);
        res.json({ error: "Nenasiel sa subor... " });
        return;
    }

    // ak je "name" != "image", tak je "req.files.image" undefined, ale hore nehodi exception...
    if (req.files.image === void 0 || req.files.image === null) {
        res.status(412);
        res.json({ error: "Nenasiel sa subor..." });
        return;
    }     
  
    const info = await irs.saveImage(file.name, file.mimetype, payload.id,  file.tempFilePath );
    if (info.error) {
        res.status(412);
        res.json({
            error: info.error
        })
        return;
    } 

    res.json({
        path: `http://${host}:${port}/${info.path.substring(7)}`, // preskocit "public/"
        thumbnailPath: `http://${host}:${port}/${info.thumbnailPath.substring(7)}`, // preskocit "public/"
    })

})



//
// start http server
//

app.listen(port, host, () => {
    console.log(`Server listening on http://${host}:${port}`)
})
