import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getFavoriteNotes, toggleFavorite } from "../controllers/favorite.controller.js";

const router = Router()

//Middleware for authentication
router.use(verifyJwt)

router.route("/toggle-favorite/:noteId").get(toggleFavorite)
router.route("/get-favorite-notes").get(getFavoriteNotes)

export default router