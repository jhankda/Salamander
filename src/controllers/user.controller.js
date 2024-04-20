import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/Apiresponse.js";
import { json } from "express";
import jwt from "jsonwebtoken";
const GenrateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Failed to generate tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    //get users details from frontend(postman)
    //validation -sholud not be empty
    //check if user already exists by email
    //check for images,check for avatar
    // upload them on cloudinary, avatar
    // create user object -create entry in DB
    // remove password and rfresh token feed from response
    // check for user creations
    // return response



    const { fullName, email, name, password } = req.body
    console.log("email:", email);

    if (
        [fullName, email, name, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")

    } else {
        console.log("All fields are filled")
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { name }]
    })
    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log("avatarLocalPath:", avatarLocalPath);
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    // console.log("avatarLocalPath:",coverImageLocalPath);
    let coverImage = "";
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
        coverImage = await uploadOnCloudinary(coverImageLocalPath)
    }



    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)


    if (!avatar) throw new ApiError(500, "Failed to upload avatar");



    const user = await User.create({
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

    if (!createdUser) {
        throw new ApiError(500, "Failed to create user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created successfully")
    )



})

const loginUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validate if email is provided and is in db
    // if not ask to sign up or try again
    // validate password 
    // generate access token and refresh token
    // provide user access token and refresh token in form of cookies
    // send response
    const {email,name,password } = req.body
    console.log("email:", email);

    if (!email && !name) {
        throw new ApiError(400, "Email and UserName are required")
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { name }]
    })
    if (!existedUser) {
        throw new ApiError(404, "User not found")
    }
    const isPasswordValis = await existedUser.isPasswordMatch(password)
    if (!isPasswordValis) {
        throw new ApiError(401, "Invalid password")

    }

    const { accessToken, refreshToken } = await GenrateAccessAndRefreshTokens(existedUser._id)

    // since we are generating accesstoken after User refrence is taken in existedUser therefore there is no refreshtoken in that refrence and we have to update it or take a new refrence

    const loggedInUser = User.findById(existedUser._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }





    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200,
            {
            "User": `${loggedInUser,accessToken,refreshToken}`
            },
            "User logged in successfully"
        ))
    




})
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id, 
        {
            $set:{refreshToken: undefined}
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"))

})

const refreshAccessToken =  asyncHandler(async(req,res) =>{
    const incomingRefreshToken  = req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized")
    }
    try {
        const decodedToken  = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(404, "invalid Refresh Token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken ){
            throw new ApiError(401, "RefreshToken is expired or Used")
        }
    
        const options  = {
            httpOnly:true,
            secure:true
        
        }
    
        const {accessToken,newrefreshToken} = await GenrateAccessAndRefreshTokens(user._id)
    
        return res
            .status(200)
            .cookie("accessToken",accessToken, options)
            .cookie("refreshToken",newrefreshToken, options)
            .json(new ApiResponse(
                200,
                {accessToken,refreshToken:newrefreshToken},
                "access Token Refreshed Successfully"))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid RefreshToken")
        
    }


})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}