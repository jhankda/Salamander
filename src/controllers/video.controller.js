
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse} from "../utils/Apiresponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {destroyFromCloudinary, uploadOnCloudinary} from "../utils/cloudinary.js"
import { upload } from "../middlewares/multer.middleware.js"
import mongoose,{Mongoose} from "mongoose"
import { json } from "express"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId} = req.query
    
    
    const fetchedVideos = await Video.aggregate([
        {
          '$search': {
            'index': 'default', 
            'text': {
              'query': query, 
              'path': {
                'wildcard': '*'
              }
            }
          }
        }, {
          '$match': {
            'owner': new mongoose.Types.ObjectId(userId)
          }
        },
        {
            '$match': {
              'isPublished': true
            }
          },
        {
          '$sort':{
            sortBy:parseInt(sortType)
          }
            
          
        }, {
          '$limit':parseInt(limit)
        }, {
          '$skip': (page - 1) * limit
        }
      ])
        console.log("yaha tak bhi ho gya")
        

        return res
        .status(200)
        .json(new ApiResponse(200,{fetchedVideos},"Videos fetched successfully"))

    



    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body

    if(!title || !description){
        throw new ApiError(400,"Please provide title and description")
    }
    
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path
    const videoLocalPath = await req.files?.videoFile?.[0]?.path
    
    if(!thumbnailLocalPath){
        throw new ApiError(400,"Please upload a thumbnail")
    }
    if (!videoLocalPath) {
        throw new ApiError(400, "Please upload a video");
    }
    const thumbnail   = await uploadOnCloudinary(thumbnailLocalPath)
    const videoFile = await uploadOnCloudinary(videoLocalPath)

    if(!videoFile){
        throw new ApiError(500,"Failed to upload video")
        
    }

    if(!thumbnail){
        throw new ApiError(500,"Failed to upload thumbnail")
        
    }
    

    const videoData = await Video.create( {
        title,
        description,
        videoFile:videoFile.url,
        thumbnail:thumbnail.url,
        duration:videoFile.duration,
        owner:req.user?._id,
        isPublished:true
    })


    const createdVideoData = await Video.findById(videoData._id).select("-duration -thumbnail")
    
    if(!createdVideoData){
        throw new ApiError(500,"Failed to create video")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{video:createdVideoData},"Video created successfully"))
    


   

    // TODO: get video, upload to cloudinary, create video 

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    console.log(videoId)


    if(!videoId){
        throw new ApiError(400,"Invalid video id")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404,"Video not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{video},"Video fetched successfully"))
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video  = await Video.findById(videoId)

    const {title, description} = req.body

    const thumbnailLocalPath = req.file?.path
    const path = req.file?.path
    console.log(path)

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if(thumbnail){
        await destroyFromCloudinary((((video?.thumbnail).split("/"))[7]).split(".")[0])

    }else{
        throw new ApiError(500,"Failed to upload thumbnail")
    }


    const updatedVideo = await Video.findByIdAndUpdate(videoId,{
        $set:{title,
        description,
        thumbnail:thumbnail.url}
    },{new:true}).select("-duration -thumbnail ")

    if(!updatedVideo){
        throw new ApiError(500,"Failed to update video")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,{video:updatedVideo},"Video updated successfully"))

    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const  {videoId}  = req.params
    console.log(videoId)

    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Video not found")
    }
    
    
    const deletedVideo  = await destroyFromCloudinary((((video?.videoFile).split("/"))[7]).split(".")[0])
    if(!deletedVideo){
        throw new ApiError(500,"Failed to delete video")
    }
    await Video.deleteOne({videoId});

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Video deleted successfully"))
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {

    const { videoId } = req.params

    const video  = await Video.findById(videoId)
    if(!video?.videoFile){
        throw new ApiError(404,"Video not found")
    }
    const updatedVideo = await Video.findByIdAndUpdate(videoId,
        
        {
            $set:{isPublished:!video.isPublished}
        },{new:true}).select("-duration -thumbnail")

    return res
    .status(200)
    .json(new ApiResponse(200,{video:updatedVideo},"Video published successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}