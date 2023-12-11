const express = require("express")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "B9B46EAF-1839-40E6-95C6-9C2ED09F2D8D";
const ROLE_VIEW_USER_PROFILE = "view_user_profile"; // ci moze vidiet profili inych userov

/** simulujeme service */
const userService = {
    users: [
        { id:1, username: "user1", password: "pwd1", fullName: "User1 User1", address:"USA", role:["admin","dev"] },
        { id:2, username: "user2", password: "pwd2", fullName: "User2 User2", address: "EU", role:["manager", ROLE_VIEW_USER_PROFILE] },
        { id:3, username: "user3", password: "pwd3", fullName: "User3 User3", address: "Africa", role:["veduci zajazdu"] },
        { id:4, username: "user4", password: "pwd4", fullName: "User4 User4", address: "Germany", role:["Projektführer"] }
    ],

    // returns null if not found or password match
    getByNameAndPassword: (n,p) => {
        n = n.toLowerCase();
        const _this = userService; // trochu krepo, neviem ako to v JS inak spravne spravit
        for (var i in _this.users) {
            const u = _this.users[i];
            if (u.username.toLowerCase() === n && u.password === p) return u;
        }
        return null;
    },

    // returns null if not found
    getById: (id) => {
        id = parseInt(id); // preistotu
        const _this = userService; // trochu krepo, neviem ako to v JS inak spravne spravit
        for (var i in _this.users) {
            const u = _this.users[i];
            if (u.id === id) return u;
        }
        return null;
    }    
}


const app = express()
app.use(bodyParser.json())

/**
 * [in] content { username:"xxx", password: "yyy"}
 * [out] HTTP 200 { id:<userId>, role:[], token:jwttoken }
 * [out] HTTP 401 { error: "zle meno alebo heslo" }
 */
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const u = userService.getByNameAndPassword( username, password )
    if (u) {
        const payload = {
            id: u.id,
            role: u.role,
            username: u.username
        }            
        const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "1h"})       
        res.send({ id: u.id, token: token})
    }
    else {
        res.status(401);
        res.send({error:"Zle meno alebo heslo"})
    }

});


/**
 * [in]  header: Authorization: Bearer <jwttoken>
 * [out] ak OK -> setne req.user = payload
 * [out] ak problem -> 401 a { error:"xxx", detail:"yyy" }
 */
const authMiddleware = (req, res, next) => {
    let authHeader = req.headers?.authorization

    const generError = (detail) => {
        res.status(401); // podla doku je 401 vhodnejsia ako 403
        res.send( { error: "Ziadna alebo chybna authentifikacia", detail: detail });    
    }

    if (authHeader == void 0) { generError("Chýba authentifikacnz header"); return; }

    // ideme vyparsovat token, cize z "bearer xxx" -> "xxx"
    const parts = authHeader.trim().split(" ");
    if (parts.length !== 2) { generError("Auth. header musi byt vo formate \"Bearer<space><token>\""); return; }
    if (parts[0].toLowerCase() !== "bearer")  { generError("Auth. header musi byt vo formate \"Bearer<space><token>\""); return; }
    
    try {
        const payload = jwt.verify(parts[1], SECRET_KEY)        
        // konecne to co toto middleWare malo za ulohu
        req.user = payload; // TADAAA!!!
    }
    catch(e) {
         generError("Nepreslo verify: " + e); 
         return; 
    }        

    next();    

}


/**
 * [in] /profile alebo /profile?full
 * [out] user-infos pre aktualne prihlaseneho usera
 */
app.post("/profile", [authMiddleware], (req, res) => {        
    const isFull = (typeof(req.query.full) !== "undefined");
    const authUserPayload = req.user; // toto uz je z middleWare. Pozor! Nie cely user, ale len payload, cize len {id, username, role}
    if (isFull) {
        // chtiacnechtiac sa musime obratit na userService
        const userFull = userService.getById(authUserPayload.id);
        // #todo: testnut ci existuje...
        // co najviac info
        res.send({
            id: userFull.id,
            username: userFull.username,
            role: userFull.role,
            fullName: userFull.fullName,
            address: userFull.address
        })
    }
    else {
        // len base info, netreba nam userService, vsetko je v payloade
        res.send({
            id: authUserPayload.id,
            username: authUserPayload.username,
            role: authUserPayload.role
        })    
    }    
})

/**
 * Zobranie profilu usera podla id, cize zvycajne ineho ako je prihlasny, ale moze byt aj ten co je prihlaseny
 * [in] /profile alebo /profile?full
 * Ak chceme profil ineho ako prihlaseneho usera, tak prihlaseny user musi mat rolu ROLE_VIEW_USER_PROFILE!
 * [out] user-infos pre usera podla id
 * [out] 403 ze nema ROLE_VIEW_USER_PROFILE
 * [out] 412 zly format ID-cka
 */
app.post("/user/:id/profile", [authMiddleware], (req, res) => {        
    // stav: 
    const authUserPayload = req.user; // tento je prihlaseny. Pozor! Nie cely user, ale len payload, cize len {id, username, role}
    const id = parseInt(req.params.id); // tohoto profil chceme ukazat
    if (isNaN(id)) { 
        res.status(412);
        res.send({ error: "ID nie je cislo"}); 
        return;
    }

    if (id !== authUserPayload.id) {
        // ak chceme profil ineho ako prihlaseneho usera, prihlaseny user musi mat rolu ROLE_VIEW_USER_PROFILE
        if (authUserPayload.role.indexOf(ROLE_VIEW_USER_PROFILE) < 0) {
            res.status(403);
            res.send({error: `Na zobrazenie cudzieho profilu musi mat prihlaseny user rolu ${ROLE_VIEW_USER_PROFILE}`});
            return;
        }
    }    
    
    const isFull = (typeof(req.query.full) !== "undefined");
    // ak chce prihlaseny user svoj profil v mini verzii, staci payload
    // ak chce prihlaseny user cudzi profil alebo chce svoj vo full verzii - uz treba volat userService.
    const profileUser =  (!isFull && authUserPayload.id === id ? authUserPayload : userService.getById(id)); 
    if (profileUser === null) {
        res.status(404);
        res.send({error:`User s id ${id} neexistuje!`}); // hmm, nenasiel sa, 
        return;
    }

    if (isFull) {
        // co najviac info
        res.send({
            id: profileUser.id,
            username: profileUser.username,
            role: profileUser.role,
            fullName: profileUser.fullName,
            address: profileUser.address
        })
    }
    else {
        // len base info
        res.send({
            id: profileUser.id,
            username: profileUser.username,
            role: profileUser.role
        })
    }    
})


/**
 * [in] /categories
 */
app.get("/categories", (req, res) => {
    res.status(404);
    res.send([
        {
            id:100,
            name:"Sport",
            examples:"futbal, hokej, ..."
        },
        {
            id:101,
            name:"Zdravie",
            examples:"Fitness, strava, ..."
        },
        {
            id:102,
            name:"Financie",
            examples:"burza, banky, domaci rozpocet, ..."
        }    
    ])
    
});


app.listen(3000, () => {
    console.log("Server is running on ....");
})