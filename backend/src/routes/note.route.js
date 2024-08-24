import { Router } from "express";

import { verifyJwt } from '../middlewares/auth.middleware.js'
import { createNote, deleteNote, getAllNotes, getNoteById, updateNote } from "../controllers/notes.controller.js";

const router = Router()

//apply authentication middleware
router.use(verifyJwt)

router.route("/create-note").post(createNote)
router.route("/update-note/:noteId").patch(updateNote)
router.route("/delete-note/:noteId").delete(deleteNote)
router.route("/get-note/:noteId").get(getNoteById)
router.route("/get-all-notes").get(getAllNotes)

export default router