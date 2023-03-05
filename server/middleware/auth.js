import jwt from 'jsonwebtoken'
import ENV from '../config.js'
export async function Auth(req, res, next){
    try {
        // access authorize header to validate request

        const token = req.headers.authorization.split(" ")[1];
       const decodedToken =  await jwt.verify(token, ENV.JWT_SECRET)
       
       req.user = decodedToken;
       
       next();
    //    return res.json(decodedToken)
 
    } catch (error) {
        return res.status(401).json({err: 'Auth Falied!'})
    }
}

export function localVariables(req, res, next) { 
    req.app.locals = {
        OTP:null,
        resetSession: false
    }
    next();
 }