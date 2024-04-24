import { Schema } from 'mongoose';
import mongooseAggregatePaginate  from 'mongoose-aggregate-paginate-v2';

const playlistSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    videos:{
        type:Schema.Types.ObjectId,
        ref:"Video"
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

export const Playlist = mongoose.model("Playlist", playlistSchema)