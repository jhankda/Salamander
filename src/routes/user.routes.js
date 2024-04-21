import {Router} from  "express";
import { changeCurrentPassword, currentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccount, updateAvatarFiles, updateCoverImageFiles } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }

    ]),
    registerUser)

router.route("/login").post(verifyJWT, loginUser)

//sercue routes
router.route("/logout").post(verifyJWT, logoutUser)

router.route("/refresh-Token").post(refreshAccessToken)

router.route("/changePsswd").post(verifyJWT,changeCurrentPassword)

router.route("/User").post(verifyJWT,currentUser)

router.route("/update-Account").patch(verifyJWT,updateAccount)

router.route("/apdate-avatar").patch(verifyJWT,upload.single("avatar"),updateAvatarFiles)

router.route("/update-coverimage").patch(verifyJWT,upload.single("coverImage"),updateCoverImageFiles)

router.route("/c/:name").get(verifyJWT,getUserChannelProfile)

router.route("/history").get(verifyJWT,getWatchHistory)

export default router;