import * as dotenv from 'dotenv'

import User from '../models/User.js'
import jwt from 'jsonwebtoken'

import express from "express";
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler'

dotenv.config({ debug: true })
const router = express.Router();







//View All Users
// export const getAllUsers = asyncHandler(async (req, res) => {
//         const users = await User.find().lean() 
//         if(!users?.length){
//             return res.status(400).json({message: 'No users found'})
//         }

//         res.json(users)
// })

// Create New Users - Post method
export const createNewUser =  asyncHandler(async (req, res) => {
    
        const {
            firstName,
             lastName,
              email, 
              password, 
              picturePath, 
              friends, 
              location, 
              occupation, 
              viewedProfile,  
              impression 
            } = req.body;
        //Check if user already exist 
        const existingUser = await User.findOne({email}).lean().exec()
        if(existingUser){
            return res.status(409).json({message: "User mail already exist"})
        }
    
        // Hash Password 
        const hashpassword = await bcrypt.hash(password, 12)
    
      
    
        //Create and Store new user object
        const result = await User.create({
            firstName,
            lastName,
             email, 
             password: hashpassword,
             picturePath, 
             friends, 
             location, 
             occupation, 
             viewedProfile: Math.floor(Math.Random() * 1000);
             impression: Math.floor(Math.Random() * 1000);
        }) ;
    
        if(result){
    
            const token = jwt.sign({email: result.email, id : result._id}, process.env.JSON_SECRET_KEY)
            res.status(201).json({result, token});
        }else{
            res.status(400).json({message: "invalid user data recieved"})
        }
    
        
    
    
   

})

// Sign in Using email and Password - Post method
export const signin = asyncHandler(async (req, res) => {

    const {email, password} = req.body;
    
    const existingUser = await User.findOne({email}).lean()
    if(!existingUser){
        return res.status(400).json({message: "User does not exist"})
    }
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

    if(!isPasswordCorrect){
        return res.status(400).json({message: "Invalid Credentials"})
    }

    const token = jwt.sign({email: existingUser.email, id : existingUser._id}, process.env.JSON_SECRET_KEY)
    res.status(201).json({result :existingUser, token});
})

// Sign In using Google authentitation

export const googleSignIn = asyncHandler(async (req, res) => {
    const {email, name, token, googleId} = req.body;

    const existingUser = await User.findOne({email}).lean.exec()
    if(existingUser){
        const result = {_id: existingUser._id.toString(), email, name}
        return res.status(200).json(result, token)
    }

    const result = await User.create({
        email,
        userName,
        googleId,
    }) ;

    if(result){
        res.status(201).json({result});
    }
})

//update user 
export const updateUser = asyncHandler(async (req, res) => {
    const {id, name, roles, active, password} = req.body;

    //Confirm Data exist
    if(!id || !Array.isArray(roles) || !name || !roles.length || typeof active !== 'boolean' ){
        return res.status(400).json({message: 'All fields are required'})
    }

    const user = await User.findById(id).exec()

    if(!user){
        return res.status(400).json({message: 'User not found'})  
    }

    const duplicate = await User.findOne({name}).lean().exec()
    //Allow update to the origina user
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message: 'Duplicate Username'})
    }

    user.name = name
    user.roles = roles
    user.active = active

    if(password){
        //Hash password
        user.password = await bcrypt.hash(password, 12) //salt round
    }

    const updateUser = await user.save()
    res.json({message : `${updateUser.name} updated`} )
})

