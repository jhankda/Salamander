import mongoose,{Schema} from 'mongoose';
import mongooseAggregatePaginate  from 'mongoose-aggregate-paginate-v2';


const videoSchema = new mongoose.Schema({
    videoFile:{
        type:String, //cloudnary stored url of video
        required:true
    },
    thumbnail:{
        type:String, //cloudnary stored url of images
        required:true
    },
    title:{
        type:String, //cloudnary stored url of images
        required:true
    },
    description:{
        type:String, //cloudnary stored url of images
        required:true
    },
    duration:{
        type:Number, //cloudnary stored url of images
        required:true
    },
    view:{
        type:String, 
        default:true
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:Schema.Types.ObjectId, 
        ref:"User"
    }

    
},{timestamps:true})


videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)