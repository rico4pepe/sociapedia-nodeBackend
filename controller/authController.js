
import * as dotenv from 'dotenv'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler'

//post rout/auth/login
//public acess
export const login = asyncHandler(async(req, res)=>{
    //
    const {email, password} = req.body
    // if(!name  || !password){

    // }

     //Check if user does not exist or is not active 
     const existingUser = await User.findOne({email}).exec()
     if(!existingUser || !existingUser.active){
         return res.status(401).json({message: "User is not authorized"})
     }

     //Check if user password is correct
     const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
     if(!isPasswordCorrect){
        return res.status(401).json({message: "Unauthorized User"})
    }

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "email": existingUser.email,
                 "roles" :existingUser.roles
                }
        }, process.env.JSON_SECRET_KEY, 
        {expiresIn: '2m'}
        
        )


        const refreshToken = jwt.sign(
            {
                "email": existingUser.email,          
            }, process.env.REFRESH_TOKEN_KEY, 
            {expiresIn: '1d'}
            
            )
            //Create a secure cookies with the refresh token
            res.cookie('jwt', refreshToken,{
                httpOnly: true, // accesible only by web server
                secure: true,  //https
                sameSite: 'None', // cross-site cookie
                maxAge: 7 * 24 * 60 * 1000 // cookie expiry: set to match refresh token 
            })

            // send accessToken with user emain and user roles
            res.json({accessToken})
})


//get rout/auth/refresh
//public acess
export const refresh = asyncHandler(async(req, res)=>{
    //
    const cookies = req.cookies
    if(!cookies?.jwt) return res.status(401).json({message: 'unauthorized'})

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY,
        asyncHandler(async(err, decoded) => {
            if(err) return res.status(403).json({message: "Forbidden"})
              const existingUser = await User.findOne({email: decoded.email}).exec()
              if(!existingUser) {
                 return res.status(401).json({message: "unauthorized"})
              }

              const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": existingUser.email,
                         "roles" :existingUser.roles
                        }
                }, process.env.JSON_SECRET_KEY, 
                {expiresIn: '2m'}
                
                )

                res.json({accessToken})
        })
    )
})

//post rout/auth/logout
//public acess clear cookies
export const logout = asyncHandler(async(req, res)=>{
    //
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204)
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure:true})
    res.json({message: 'Cookie Cleared'})
})