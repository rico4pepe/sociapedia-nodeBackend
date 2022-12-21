import express from "express";

import {getUsers, getUserFriend, addRemoveFriend, updateUser} from "../controller/userController.js";
import {verifyJwt} from "../middleware/verifyJwt.js"


const router = express.Router();

router.use(verifyJwt)

router.get("/:id", getUsers);
router.get("/:id/friends", getUserFriend);
router.patch("/:id/friendId", addRemoveFriend)
router.get("/updateuser", updateUser)


  

export default router;