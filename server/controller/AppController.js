import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import otpGenerator from 'otp-generator'
import ENV from '../config.js'
import UserModel from '../model/User.model.js';

// Middleware for verifyUser
export const verifyUser = async (req, res, next) =>{
    try {
        const {username} = req.method == "GET" ? req.query : req.body;
        
        // check the user existance
        let exist = await UserModel.findOne({username})
        if(!exist) return res.status(404).send({error: "Can't find User!"})
        next();
    } catch (error) {
        return res.status(404).send({error:'Auth Error'})
    }
}

// Register 
export const register = async (req, res) =>{
    try {
        const {username, email, password, profile} = req.body;

        // check the existing username
        const existingUsername = new Promise((resolve, reject) =>{
            UserModel.findOne({username}, function(err, user){
                if(err) reject(new Error(err))
                if(user) reject({error: 'Please use unique username'});

                resolve();
            })
        })

        // check the existing email
        const existingEmail = new Promise((resolve, reject) =>{
            UserModel.findOne({email}, function(err, user){
                if(err) reject(new Error(err))
                if(user) reject({error: 'Please use unique email address'});
                resolve();
            })
        })

        Promise.all([existingUsername, existingEmail])
                .then(()=>{
                    if(password){
                        bcrypt.hash(password, 10)
                                .then(hashedPassword =>{

                                    // Save UserData
                                    const user = new UserModel({
                                        username,
                                        password: hashedPassword,
                                        email: email,
                                        profile: profile || ''
                                    })
                                    user.save()
                                        .then(result => res.status(201).send({msg: 'User Registered Successfully'}))
                                        .catch(error => res.status(500).send({error}))
                                }).catch(error =>{
                                    return res.status(500).send({
                                        error: 'Enable to hashed password'
                                    })
                                })
                    }
                }).catch(error =>{
                    return res.status(500).send({error})
                })
        
    } catch (error) {
        return res.status(500).send(error)
    }
}

// login 
export const login = async (req, res) =>{
    const {username, password} = req.body;
    try {
        UserModel.findOne({username})
        .then(user =>{

            // return res.status(200).send({
            //     user, username})

            bcrypt.compare(password, user.password)
                .then(passwordCheck => {
                    if(!passwordCheck) return res.status(400).send({error:"Don't have password"})
                    
                    // create jwt token
                  const token = jwt.sign({
                        userId : user._id,
                        username : user.username
                    }, ENV.JWT_SECRET, {expiresIn: "24h"})
                    
                    return res.status(200).send({
                        msg:"Login Success",
                        username: user.username,
                        token
                    })
                })
        })
   } catch (error) {
    return res.status(404).send({error: "Username not found"})
   }
}

// getUser 
export const getUser = async (req, res) =>{
    const {username} = req.params;
    try {
            if(!username) return res.status(501).send({error: "Invalid Username"})
            UserModel.findOne({username}, function (err, user) { 
                if(err) return res.status(500).send({err})
                if(!user) return res.status(501).send({error:"Couldn't find the user"});

                const {password, ...rest} = Object.assign({}, user.toJSON());

                return res.status(201).send(rest)

             })
        } catch (error) {
        return res.status(404).send({error:"Cannot find user data"})
    }
}

// updateUser 
export const updateUser = async (req, res) =>{

    try {
        // const id = req.query.id;
        const { userId } = req.user;
        if(userId){ 
            const body = req.body;

            // Update user
            UserModel.updateOne({_id:userId}, body, function(err, data){
                if(err) throw err;
                return res.status(201).send({msg: "Record Updated...!"})
            })
        }
    } catch (error) {
        return res.status(401).send({error});
    }

}

// generateOTP 
export const generateOTP = async (req, res) =>{
   req.app.locals.OTP = await otpGenerator.generate(6, {lowerCaseAlphabets:false, upperCaseAlphabets:false, specialChars: false})
    return res.status(201).send({code:req.app.locals.OTP })
}

// verifyOTP 
export const verifyOTP = async (req, res) =>{
    const {code} = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null;
        req.app.locals.resetSession = true;
        return res.status(201).send({msg:'Verify Successfully'})
    }
    return res.status(400).send({error: 'Invalid OTP'})
}

// createResetSession 
export const createResetSession = async (req, res) =>{
    if(req.app.locals.resetSession){
        req.app.locals.resetSession = false; // allow access to this routes only onces
        return res.status(201).send({msg:'Access Granted'}) 
    }
    return res.status(440).send({error: 'Session expired'})
}

// resetPassword 
export const resetPassword = async (req, res) =>{
    try {
        
    
    if(!req.app.locals.resetSession) return res.status(440).send({error: 'Session expired'})
    
        const {username, password} = req.body;
        try {
            UserModel.findOne({username})
                    .then(user =>{
                        bcrypt.hash(password, 10)
                                .then(hashedPassword =>{
                                    UserModel.updateOne({username: user.username},
                                        {password:hashedPassword}, function(err, data){
                                            if(err) throw err;
                                            req.app.locals.resetSession = false; 

                                            return res.status(201).send({msg:'Record Updated'})
                                        }
                                    )
                                })
                                .catch(err => {
                                    return res.status(500).send({
                                        error:'Unable to hashed password'
                                    })
                                })
                    })
                    .catch(error =>{
                        return res.status(404).send({error:'Username not found'})
                    })
        } catch (error) {
            return res.status(500).send({error})
        }
    } catch (error) {
        return res.status(401).send({error})
    }
}