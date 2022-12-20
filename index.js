import * as dotenv from 'dotenv'
import express from 'express';
import bodyParser from 'body-parser'
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

import helmet from 'helmet';
import multer from 'multer';
import path from 'path';
import {fileURLToPath} from 'url';
import connectDB from './config/connectDB.js'
import  authRouter from './routes/authRoutes.js'

// Configuration  of Middle ware /

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


dotenv.config({ debug: true })
console.log(process.env.NODE_ENV)

connectDB();
const app = express();
app.use(express.json);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}))
app.use(morgan("common"))
app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit : "30mb", extended: true}))
app.use(cors())
app.use('/', express.static('public'))


const authPrefix =  "/api/myPaedia/auth"; 
//app.use('/assets', express.static(path.join(__dirname,  'public/assets')))


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

app.use(authPrefix, upload.single("picture"), authRouter);

const port = process.env.PORT || 5000;




//app.use(errorHandler)  
mongoose.connection.once('open', ()=>{
    console.log("Connected to MongoBB")
    app.listen(port, () => console.log(`Listening on locahost: ${port}`));

})

mongoose.connection.on('error', err=>{
    console.log(err)
})