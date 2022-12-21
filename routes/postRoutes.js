import express from "express";
import {getFeedPosts, getUserPosts, likePosts} from "../controller/postController.js";
import {verifyJwt} from "../middleware/verifyJwt.js"


const router = express.Router();


router.use(verifyJwt)


//READ //
router.get("/", getFeedPosts);
router.get("/:userId/posts", getUserPosts);

//UPDATE//
router.patch("/:id/likes", likePosts);


export default router;