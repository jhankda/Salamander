import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/Apiresponse.js";

const registerUser  = asyncHandler(async (req,res) => {
    //get users details from frontend(postman)
    //validation -sholud not be empty
    //check if user already exists by email
    //check for images,check for avatar
    // upload them on cloudinary, avatar
    // create user object -create entry in DB
    // remove password and rfresh token feed from response
    // check for user creations
    // return response



    const {fullName, email ,name , password} =req.body
    console.log("email:",email);

    if(
        [fullName, email ,name , password].some((field)=> 
        field?.trim() === "")
    ){
        throw new ApiError(400,"All fields are required")

    }else{
        console.log("All fields are filled")
    }

    const existedUser = await User.findOne({
        $or: [{email},{name}]
    })
    if(existedUser){
        throw new ApiError(409,"User already exists")}

    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log("avatarLocalPath:",avatarLocalPath);
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar)throw new ApiError(500,"Failed to upload avatar");



    const user  = await User.create({
        fullName,
        email,
        name: name.toLowerCase(),
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Failed to create user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created successfully")
    )



})


export {registerUser}