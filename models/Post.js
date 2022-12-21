import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    userId:{type:String, required:true,},
    firstName:{type:String, required:true, min:2, max: 50,},
    lastName:{type:String, required:true, min:2, max: 50,},
   
     picturePath:{type:String, default: "",},
     userPicturePath:{type:String, default: "",},
     location: {type:String},
     description: {type:String},
     like:{type:Map, of: Boolean,},
     comment:[{type:String, default:""}],
}, 
{timestamps: true}
)


const Post = mongoose.model("Post", postSchema);
export default Post;