import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/Apiresponse.js"

const createTweet = asyncHandler(async (req, res) => {
    const {content}  = req.body
    const {userId}  = req.params

    const user  = await User.findById(userId)

    if(!user){
        throw new ApiError(404, "User not found")
    }

    const tweet  = await Tweet.create({
        content,
        owner: new mongoose.Types.ObjectId(userId)
    })

    return res
    .status(200)
    .json(new ApiResponse(200,tweet,"Tweet is created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    const {userId} = req.params

    const user = await User.findById(userId)
    if(!userId){
        throw new ApiError(404, "User not found")
    }

    const tweets  = await Tweet.aggregate(
        [
            {
              '$match': {
                'owner': new mongoose.Types.ObjectId('6628ceb0d62b6c726b1fd773')
              }
            }, {
              '$lookup': {
                'from': 'users', 
                'localField': 'owner', 
                'foreignField': '_id', 
                'as': 'owner'
              }
            }, {
              '$addFields': {
                'owner': {
                  '$first': '$owner'
                }
              }
            }, {
              '$addFields': {
                'name': '$owner.name', 
                'email': '$owner.email'
              }
            }, {
              '$sort': {
                'createdAt': 1
              }
            },{
                '$project':{
                    name:1,
                    email:1,
                    content:1,
                    createdAt:1
                
                }
            }
          ]
    )
    // TODO: get user tweets

    return res
    .status(200)
    .json(new ApiResponse(200,tweets," Tweets retrieved successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    const {userId} = req.params
    const { tweetId} = req.query
    const {content} = req.body

    // if(userId != req.user._id){
    //     throw new ApiError(401, "You are not authorized to update this tweet")
    // }

    const tweet = await Tweet.findByIdAndUpdate(tweetId,{
        $set:{
            content

            
        }

    },{new:true}).select("_id content owner")

    return res
    .status(200)
    .json(new ApiResponse(200,tweet,"Tweet is updated successfully"))
    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params

    const tweet = await Tweet.findByIdAndDelete(tweetId)


    //TODO: delete tweet
    return res
    .status(200)
    .json(new ApiResponse(200,tweet,"Tweet is deleted successfully"))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
