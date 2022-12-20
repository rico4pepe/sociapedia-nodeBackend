import express from "express";
//import {loginLimiter} from "../middleware/loginLimit.js"
import {login, refresh, logout} from "../controller/authController.js"


const router = express.Router();

router.route('/')
.post(login)
//router.post('/');

router.route('/refresh')
.get(refresh)

router.route('/logout')
.post(logout)


export default router;