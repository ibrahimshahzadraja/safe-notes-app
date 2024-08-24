import { ApiError } from "../utils/ApiError.js"

export const getAvatarFileStr = async (req, res, next) => {
    try {
        if(req.file){
            const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
    
            req.avatarStr = fileStr
        }
        next()
    } catch (error) {
        throw new ApiError(500, error?.message || "Error while getting avatar")
    }
}