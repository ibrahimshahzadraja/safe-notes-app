import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Note } from "../models/Note.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValidObjectId } from "mongoose";

const createNote = asyncHandler(async(req, res) => {
    const {title, body} = req.body
    const owner = req.user?._id

    if(!title || !body){
        throw new ApiError(400, "Note title and body is required")
    }

    const note = await Note.create({title, body, owner})

    if(!note){
        throw new ApiError(500, "Error while creating note")
    }

    res.status(200).json(new ApiResponse(200, note, "Note created successfully"))
})

const updateNote = asyncHandler(async(req, res) => {
    const {title, body} = req.body
    const {noteId} = req.params

    if(!isValidObjectId(noteId)){
        throw new ApiError(400, "Invalid note id")
    }

    if(!title || !body){
        throw new ApiError(400, "Note title and body is required")
    }

    const note = await Note.findByIdAndUpdate(noteId, {$set: {title, body}}, {new:true})

    if(!note){
        throw new ApiError(500, "Error while updating note")
    }

    res.status(200).json(new ApiResponse(200, note, "Note updated successfully"))
})

const deleteNote = asyncHandler(async(req, res) => {
    const {noteId} = req.params

    if(!isValidObjectId(noteId)){
        throw new ApiError(400, "Invalid note id")
    }

    await Note.findByIdAndDelete(noteId)

    res.status(200).json(new ApiResponse(200, {}, "Note deleted successfully"))
    
})

const getNoteById = asyncHandler(async(req, res) => {
    const {noteId} = req.params

    if(!isValidObjectId(noteId)){
        throw new ApiError(400, "Invalid note id")
    }

    const note = await Note.findById(noteId)

    if(!note){
        throw new ApiResponse(500, "Error while getting the note")
    }

    res.status(200).json(new ApiResponse(200, note, "Note fetched successfully"))
})

const getAllNotes = asyncHandler(async(req, res) => {
    const notes = await Note.find({owner: req.user?._id})
    if(!notes){
        throw new ApiError(404, "No notes found")
    }

    res.status(200).json(new ApiResponse(200, notes, "Notes fetched successfully"))
})

export{
    createNote,
    updateNote,
    deleteNote,
    getNoteById,
    getAllNotes
}