import { Router } from "express";
import {getSubscribedChannels, getUserChannelSubscribers, toggleSubscription} from "../controllers/subToggler.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/toggleSubscription/:channelId").patch(verifyJWT,toggleSubscription)

router.route("/subscribers/:channelId").get(verifyJWT,getUserChannelSubscribers)

router.route("/follows/:subscriberId").get(verifyJWT,getSubscribedChannels)

export default router;