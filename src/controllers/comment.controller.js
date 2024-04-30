import mongoose from "mongoose"
import {Comment} from "../models/comment.models.js"
import {ApiError} from "../utils/ApiError.js"
import { Video } from "../models/video.models.js"

import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/Apiresponse.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const getcomments  = await Comment.aggregate(
        [
            {
              $match: {
                video:new mongoose.Types.ObjectId(videoId)
              }
              
            },
            {
              $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner'
              }
            },
            {
              $addFields: {
                subscriber: {
                  $first:"$owner"
                }
              }
            },
            {
              $addFields: {
                name:"$owner.name",
                email:"$owner.email"
              }
            },
            {
              $project:{
                name:1,
                email:1,
                createdAt:1,
                content:1

              }
            },
            {
                '$sort':{
                    createdAt:1
                
                }
            },
            {
                '$limit':limit
            },
            {
                '$skip':(page-1)*limit
            }
          ]
    )

    return res
    .status(200)
    .json(new ApiResponse(200, getcomments,"comments retrieved successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    const  {content} = req.body
    console.log(req.body)
    const {videoId} = req.params
    
    const video = await Video.findById(videoId)

    if(!video)
    {
        throw new ApiError(404, "Video not found")
    }
    console.log("---->")

    // const { content} = req.body

    console.log(typeof content)
    console.log(content)
    console.log("<---")

    const newcomment = await Comment.create({
        content,
        owner: req.user._id,
        video: new mongoose.Types.ObjectId(videoId)
    })


    return res
    .status(200)
    .json(new ApiResponse(200, newcomment,"comment added successfully"))

    // TODO: add a comment to a video
})

const updateComment = asyncHandler(async (req, res) => {


    const {commentId} = req.params

    

    const updatecomment  = Comment.findByIdAndUpdate(commentId,req.body,{new:true})

    return res
    .status(200)
    .json(new ApiResponse(200, updatecomment,"comment updated successfully"))

    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    const deletecomment = Comment.findByIdAndDelete(commentId)
    // TODO: delete a comment
    return res
    .status(200)
    .json(new ApiResponse(200, deletecomment,"comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
