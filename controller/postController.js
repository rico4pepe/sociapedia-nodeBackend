import Posts from '../models/Post.js'
import User from '../models/User.js'

import express from "express";

import asyncHandler from 'express-async-handler'

//CREATE POST
export const createPost = asyncHandler(async (req, res) => {

    const {
        userId,
        picturePath, 
         description, 
        
        } = req.body;

        const user = await User.findById(userId)

        
        //Create and Store new Post

        const result =  await  Posts.create({
                userId,
                firstName: user.firstName,
                lastName: user.lastName,
                location: user.location,
                userPicturePath: user.picturePath,
               picturePath, 
               description, 
               like:{

               },
               comment:[],
        }) ;

        if(result){
            const post = await Post.find()
            
            res.status(201).json({post});
        }else{
            res.status(400).json({message: "An error Occured"})
        }
})





export const getFeedPosts   = asyncHandler(async (req, res) => {
    const allPost = await Posts.find().lean() 
    if(!allPost?.length){
        return res.status(400).json({message: 'No users found'})
    }

    res.json.status(200).json(allPost)
})


export const getUserPosts   = asyncHandler(async (req, res) => {

    const {userId} = req.params;
    const userPost = await Posts.find(userId).lean() 
    if(!userPost?.length){
        return res.status(400).json({message: 'No post from user'})
    }

    res.json.status(200).json(userPost)
})




export const likePosts   = asyncHandler(async (req, res) => {
    const {userId} = req.body;
    const {id } = req.params;

    const post = await Posts.findById(id) 

    const isLiked = post.like.get(userId)

    if(isLiked){
        post.like.delete(userId)
    }else{
        post.like.set(userId, true)
    }

    const updatePost = await Posts.findByIdAndUpdate(
        id,
        {likes: post.like},
        {new: true}
    )

    if(updatePost){
        res.json.status(200).jjson(updatePost)
    }else{
        res.status(400).json({message: "An error Occured"})
    }

    
})