import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from '../utils/ApiError.js'
import { User } from "../models/User.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"

const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'None'
}

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
    
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
    
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Error while generating access and refresh token")
    }
}

const registerUser = asyncHandler( async(req, res) => {

    const {username, password, confirmPassword, about} = req.body

    if(!req.avatarStr){
        throw new ApiError(400, "Avatar is required")
    }

    if(!(password===confirmPassword)){
        throw new ApiError(400, "Passwords doesn't match")
    }

    if(!username || !password){
        throw new ApiError(400, "Username and Password is required")
    }

    const existedUser = await User.findOne({username})

    if(existedUser){
        throw new ApiError(409, "User already exist")
    }
    
    const avatar = await uploadOnCloudinary(req.avatarStr)
    
    if(!avatar){
        throw new ApiError(500, "Error while uploading avatar")
    }

    const user = await User.create({
        username,
        password,
        about,
        avatar: avatar?.url
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "Error while registering the user.")
    }

    res.status(200).json(new ApiResponse(200, createdUser, "User registered successfully"))
})

const loginUser = asyncHandler(async(req, res) => {
    const {username, password} = req.body

    const user = await User.findOne({username})

    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if(!isPasswordCorrect){
        throw new ApiError(401, "Incorrect Password")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


    res.status(200)
    .cookie("accessToken", accessToken, {...options, maxAge: 24 * 60 * 60 * 1000})
    .cookie("refreshToken", refreshToken, {...options, maxAge: 10 * 24 * 60 * 60 * 1000})
    .json(new ApiResponse(200,{user: loggedInUser, accessToken, refreshToken}, "User logged in successfully"))
})

const logoutUser = asyncHandler(async(req, res) => {
    const user = await User.findByIdAndUpdate(req.user?._id, {
        $unset: {
            refreshToken: 1
        }
    })

    res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))
})

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select()
    
        if(!user){
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if(incomingRefreshToken !== user.refreshToken){
            throw new ApiError(401, "Refresh token expired or used")
        }
    
        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    
        res.status(200)
        .cookie("accessToken", accessToken, {...options, maxAge: 24 * 60 * 60 * 1000})
        .cookie("refreshToken", refreshToken, {...options, maxAge: 10 * 24 * 60 * 60 * 1000})
        .json(new ApiResponse(200, {accessToken, refreshToken}, "Access token refreshed"))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const getCurrentUser = asyncHandler(async(req, res) => {
    res.status(200).json(new ApiResponse(200, req.user, "Current user fetched"))
})


const updateUserProfile = asyncHandler(async(req, res) => {
    const {username, about, oldPassword, newPassword, usernameChanged} = req.body

    
    const update = {}

    if(usernameChanged !== 'false'){
        const user = await User.findOne({username})
        if(user){
            throw new ApiError(400, "Username already exists")
        }
        update["username"] = username
    }

    if(about !== ''){
        update["about"] = about
    }

    if(oldPassword && newPassword){
        if (oldPassword.length < 8 || newPassword.length < 8){
            throw new ApiError(400, "Passwords length must be atleast 8 characters")
        }
        const user = await User.findById(req.user?._id)
    
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    
        if(!isPasswordCorrect){
            throw new ApiError(400, "Invalid old password")
        }
    
        user.password = newPassword;
        await user.save({validateBeforeSave: false})
    }
    if((oldPassword === "" && newPassword) || (newPassword === "" && oldPassword)){
        throw new ApiError(400, "Both passwords are required")
    }

    if(Object.keys(update).length > 0){
        await User.findByIdAndUpdate(req.user?._id, {$set: update})
    
    }

    if(req.avatarStr){
        const avatar = await uploadOnCloudinary(req.avatarStr)
        
        if(!avatar){
            throw new ApiError(400, "Avatar is required")
        }
        
        await User.findByIdAndUpdate(req.user?._id, {$set: {avatar: avatar?.url}}, {new: true}).select("-password -refreshToken")
    }
    
    res.status(200).json(new ApiResponse(200, {}, "User profile updated"))
    
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser,
    updateUserProfile
}