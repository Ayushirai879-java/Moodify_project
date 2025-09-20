import {Router} from "express";
import { likeSong,getLikedSongs } from "../controller/likedSong.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js";
const router = Router();

router.post("/:songId", protectRoute, likeSong);
router.get("/", protectRoute, getLikedSongs);
export default router;