import { Router } from "express";
import {upload}  from "../middlewares/multer.middleware.js";
import {getAllVideos,publishAVideo,getVideoById,updateVideo,deleteVideo,togglePublishStatus} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/getallvideos").post(
    verifyJWT, getAllVideos);
router.route("/publishvideo").post(upload.fields([
    {
    name:"videoFile",
    maxCount:1
},
{
    name:"thumbnail",
    maxcount:1
}]),verifyJWT, publishAVideo);

router.route("/deletevideo/:videoId").delete(verifyJWT, deleteVideo);

router.route("/updatevideo/:videoId").patch(verifyJWT,upload.single("thumbnail"), updateVideo);

router.route("/getvideo/:videoId").get(verifyJWT, getVideoById);

router.route("/togglepublishstatus/:videoId").patch(verifyJWT, togglePublishStatus);



export default router;