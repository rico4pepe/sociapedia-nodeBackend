import * as dotenv from 'dotenv'

import User from '../models/User.js'
import jwt from 'jsonwebtoken'

import express from "express";
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler'




// Create New Users - Post method
export const createNewUser =   asyncHandler(async (req, res) => {


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

        const result =  await  User.create({
            firstName,
            lastName,
             email, 
             password: hashpassword,
              picturePath, 
              friends, 
              location, 
              occupation,
              viewedProfile: Math.floor(Math.random() * 1000), 
              impression : Math.floor(Math.random() * 1000),
      
        }) ;
      
        // const savedUser = await newUser.save();
    
        if(result){
    
            const token = jwt.sign({email: result.email}, process.env.JSON_SECRET_KEY)
            res.status(201).json({result, token});
        }else{
            res.status(400).json({message: "invalid user data recieved"})
        }
       
})
    
   
export const getUsers   = asyncHandler(async (req, res) => {

            const {id} = req.params
             //const user = await User.findOne(id).lean() 
          
             const user = await User.findById(id)

             console.log('Console log user ', user)
         
             if(user){
                res.status(200).json(user)
             }else{
                res.status(404).json({message: 'An error occured'})
             }
             
    })

    export const getUserFriend   = asyncHandler(async (req, res) => {

        const {id} = req.params
         //const user = await User.findOne(id).lean() 
         const user = await User.findById(id)
         if(!user?.length){
             return res.status(400).json({message: 'The name does not exist'})
         }

         if(user){ 
                const friends = await Promise.all(
                    user.friends.map((id) => User.findById(id)
                ));
                const formattedFriends = map(
                    ({_id, firstName, lastName, picturePath, occupation}) => {
                        return {_id, firstName, lastName, picturePath, occupation}
                    }
                )
                res.status(200).json(formattedFriends)
         }else{
            res.status(404).json({message: 'An error occured'})
         }
         
})

//Update Friends
export const addRemoveFriend   = asyncHandler(async (req, res) => {

    const {id, friendId} = req.params
     //const user = await User.findOne(id).lean() 
     const user = await User.findById(id)
     const friend = await User.findById(friendId)
     if(user.friends.include(friendId)){
        user.friends = user.friends.filter((id) => id !== friendId);
        friend.friends = friend.friends.filter((id) =>id !== id)
     }else{
        user.friends.push(friendId)
        user.friends.push(id)
     }
     await user.save()
     await friends.save()

     if(user  && friends ){
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id)
        ));
        const formattedFriends = map(
            ({_id, firstName, lastName, picturePath, occupation}) => {
                return {_id, firstName, lastName, picturePath, occupation}
            }
        )
        res.status(200).json(formattedFriends)
     }else{
        res.status(404).json({message: 'An error occured'})
     }
})



// Sign in Using email and Password - Post method
// export const signin = asyncHandler(async (req, res) => {

//     const {email, password} = req.body;
    
//     const existingUser = await User.findOne({email}).lean()
//     if(!existingUser){
//         return res.status(400).json({message: "User does not exist"})
//     }
//     const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

//     if(!isPasswordCorrect){
//         return res.status(400).json({message: "Invalid Credentials"})
//     }

//     const token = jwt.sign({email: existingUser.email, id : existingUser._id}, process.env.JSON_SECRET_KEY)
//     res.status(201).json({result :existingUser, token});
// })

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

