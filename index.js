import * as dotenv from 'dotenv'
import express from 'express';
//import bodyParser from 'body-parser'
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser  from "cookie-parser";
import helmet from 'helmet';
import multer from 'multer';
import path from 'path';
import {fileURLToPath} from 'url';
import connectDB from './config/connectDB.js'
import  authRouter from './routes/authRoutes.js'
import {createNewUser} from './controller/userController.js'
import {logger} from "./middleware/logger.js"
import userRouter from "./routes/userRoutes.js"
import postRouter from "./routes/postRoutes.js"
import {verifyJwt} from "./middleware/verifyJwt.js"
import {createPost} from './controller/postController.js'
import User from './models/User.js';
import Post from './models/Post.js';
import {users, posts} from './data/index.js'

// Configuration  of Middle ware /

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


dotenv.config({ debug: true })
console.log(process.env.NODE_ENV)

connectDB();
const app = express();
app.use(logger )


app.use(express.json())//For JSON requests
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}))
app.use(morgan("common"))
app.use(cors())



app.use('/', express.static('public'))


const authPrefix =  "/api/v2/auth"; 
const postprefix = "/api/v2/post"; 
const userprefix = "/api/v2/user"; 
//app.use('/assets', express.static(path.join(__dirname,  'public/assets')))
const port = process.env.PORT || 5000;

//File Storage /
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/assets")

    },
    filename: function(req, file, cb){
        cb(null, file.originalName)
    }
})

const upload = multer ({storage})


// Mongoose SetUp
//router.post("/signin", signin);
app.post('/api/v2/register', upload.single('picture'), createNewUser);
app.post('/api/v2/post/posts', verifyJwt, upload.single('picture'), createPost)



// APi Authentication
app.use(authPrefix,  authRouter);

//User Routes
app.use(userprefix, userRouter);

//Post Routes
app.use(postprefix, postRouter);

//const port = process.env.PORT || 5000;




//app.use(errorHandler)  
mongoose.set('strictQuery', true);
mongoose.connection.once('open', ()=>{
    console.log("Connected to MongoBB")
    // User.insertMany(users)
    // Post.insertMany(posts)
    app.listen(port, () => console.log(`Listening on locahost: ${port}`));
 
})

mongoose.connection.on('error', err=>{
    console.log(err)
})