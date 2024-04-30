import { Router } from "express";
import {getVideoComments, addComment, updateComment,deleteComment}    from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router  = Router()

router.route("/get/:videoId").get(getVideoComments)
router.route("/add/:videoId").post(verifyJWT,addComment)
router.route("/update/:commentId").patch(verifyJWT,updateComment)
router.route("/del/:commentId").delete(verifyJWT,deleteComment)

export default router;