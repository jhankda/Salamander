import mongoose from "mongoose"
import {User} from "../models/user.models.js"
import { Subscription } from "../models/subscriber.models.js"
import {ApiError} from "../utils/ApiError.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/Apiresponse.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const userId = req.user?._id
    console.log(channelId)
    console.log(userId)
    console.log(typeof(channelId))
    
    const myid = channelId+""+userId
    const checkChannel = await  Subscription.findOne({
        $and:[{channel:channelId},{subscriber:userId}]
    })
    // console.log(checkChannel)
    if(checkChannel){
            new ApiResponse(200,checkChannel, "Subscription found")
            console.log("channel not found")
        }
       
     
   
    

    
    let newSubscription;
    if(!checkChannel){
        newSubscription = await Subscription.create({
            
            channel:channelId,
            subscriber:req.user._id
        })
        console.log("subscribed")
    }
    else{
        newSubscription = await Subscription.findByIdAndDelete(checkChannel._id)
        console.log("unsubscribed")


    }
    // console.log(newSubscription)

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Subscription toggled successfully"))


})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!channelId){
        throw new ApiError(400, "Channel id is required")
    }


    const subscriberList = await Subscription.aggregate([
        {
          '$match': {
            'channel': new ObjectId('channelId')
          }
        }, {
          '$lookup': {
            'from': 'users', 
            'localField': 'subscriber', 
            'foreignField': '_id', 
            'as': 'subscriber'
          }
        }, {
          '$addFields': {
            'subscriber': {
              '$first': '$subscriber'
            }
          }
        }, {
          '$addFields': {
            'email': '$subscriber.email', 
            'name': '$subscriber.name'
          }
        }, {
          '$project': {
            'name': 1, 
            'email': 1
          }
        }, {
          '$sort': {
            'createdAt': 1
          }
        }
      ])
    if (!subscriberList) {
        throw new ApiError(404, "No subscribers found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, subscriberList, "Subscriber list fetched successfully"))

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!subscriberId){
        throw new ApiError(400, "Subscriber id is required");
    }
    const channelList = await Subscription.aggregate(
        [
            {
              '$match': {
                'subscriber': new mongoose.Types.ObjectId('subscriberId')
              }
            }, {
              '$lookup': {
                'from': 'users', 
                'localField': 'channel', 
                'foreignField': '_id', 
                'as': 'channel'
              }
            }, {
              '$addFields': {
                'channel': {
                  '$first': '$channel'
                }
              }
            }, {
              '$addFields': {
                'channelName': '$channel.name', 
                'channelMailId': '$channel.email'
              }
            }, {
              '$project': {
                'channelName': 1, 
                'channelMailId': 1
              }
            }, {
              '$sort': {
                'createdAt': -1
              }
            }
          ]
    ) 

    if(!channelList){
        throw new ApiError(404, "No channels found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, channelList, "Subscribed channels fetched successfully"))

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}