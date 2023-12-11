const jwt = require("jsonwebtoken")
const SECRET_KEY = "B9B46EAF-1839-40E6-95C6-9C2ED09F2D8D";

const payload = {
    email:"ja@ty.sk",
    id:5,
    role:["admin", "tester"]
}

const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "1h"})
console.log(token)

try {
    const decoded = jwt.verify(token, SECRET_KEY +"x")
    console.log(decoded)
}
catch(e) {
    console.log("decoded error: " + e)
}
