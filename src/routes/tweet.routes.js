import Router from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {createTweet, deleteTweet, getUserTweets, updateTweet} from "../controllers/tweet.controller.js";


const router = Router();

router.route("/create/:userId").post(verifyJWT, createTweet);
router.route("/get/:userId").get(verifyJWT,getUserTweets);
router.route("/del/:tweetId").delete(verifyJWT,deleteTweet);
router.route("/update/:tweetId").patch(verifyJWT,updateTweet);

export default router; 