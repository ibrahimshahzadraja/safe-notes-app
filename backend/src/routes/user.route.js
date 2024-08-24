import { Router } from "express";

import {upload} from "../middlewares/multer.middleware.js"
import { signupValidation, loginValidation, updateProfileValidation } from "../middlewares/joi.middleware.js";
import { getAvatarFileStr } from "../middlewares/avatar.middleware.js";

import { getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateUserProfile } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(upload.single("avatar"), getAvatarFileStr, signupValidation, registerUser)

router.route("/login").post(loginValidation, loginUser)

//secured routes
router.route("/logout").get(verifyJwt, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/get-user").get(verifyJwt, getCurrentUser)
router.route("/update-profile").patch(verifyJwt, upload.single("avatar"), getAvatarFileStr, updateProfileValidation, updateUserProfile)

export default router