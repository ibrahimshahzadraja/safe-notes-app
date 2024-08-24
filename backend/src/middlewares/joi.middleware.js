import Joi from "joi";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const signupValidation = asyncHandler( async (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().min(5).max(20).required().regex(/^[a-zA-Z0-9_]+$/).messages({'string.pattern.base': "Only letters and numbers are allowed in username"}),
        password: Joi.string().min(8).required(),
        about: Joi.string().max(97),
        confirmPassword: Joi.string().min(8).required()
    })

    const {avatar, ...data} = req.body
    const {error} = schema.validate(data)

    if(error){
        res.status(400).json(new ApiResponse(400, {}, error?.details[0].message))
    }

    next()
})

export const updateProfileValidation = asyncHandler( async (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().min(5).max(20).regex(/^[a-zA-Z0-9_]+$/).messages({'string.pattern.base': "Only letters and numbers are allowed in username"}),
        password: Joi.string().min(8),
        about: Joi.string().max(97),
        confirmPassword: Joi.string().min(8)
    })

    const {avatar, ...data} = req.body
    const {error} = schema.validate(data)

    if(error){
        res.status(400).json(new ApiResponse(400, {}, error?.details[0].message))
    }

    next()
})

export const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().min(5).max(20).required(),
        password: Joi.string().min(8).required(),
    })

    const {error} = schema.validate(req.body)

    if(error){
        res.status(400).json(new ApiResponse(400, {}, error?.details[0].message))
    }

    next()
}