import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Favorite } from "../models/Favorite.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const toggleFavorite = asyncHandler(async(req, res) => {
    const {noteId} = req.params

    let added;

    const note = await Favorite.findOne({noteId})

    if(!note){
        const newFavNote = await Favorite.create({userId: req.user?._id, noteId})

        if(!newFavNote){
            throw new ApiError(500, "Error while adding note to favorite")
        }

        added=true;
    } else{
        await Favorite.findOneAndDelete({noteId})

        added=false;
    }

    res.status(200).json(new ApiResponse(200, {}, `Note ${added ? "added to" : "removed from"} favorites`))

})

const getFavoriteNotes = asyncHandler(async(req, res) => {
    const favNotes = await Favorite.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(`${req.user?._id}`)
          }
        },
        {
          $lookup: {
            from: "notes",
            localField: "noteId",
            foreignField: "_id",
            as: "result"
          }
        },
        {
          $addFields: {
            favNote: {
              $first: "$result"
            }
          }
        },
        {
          $project: {
            favNote: 1
          }
        }
      ])


    if(!favNotes){
        throw new ApiError(404, "No notes added to favorites")
    }

    res.status(200).json(new ApiResponse(200, favNotes, "Favorite notes fetched successfully"))
})

export {
    toggleFavorite,
    getFavoriteNotes
}