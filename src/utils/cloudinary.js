import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// import { asyncHandler } from "./asyncHandler";





console.log(cloudinary.config().cloud_name);


const uploadOnCloudinary = async (localFilePath) => {
    try {
        
        const response = await cloudinary.uploader.upload(localFilePath).then((result) => console.log(result));
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
};
        

export { uploadOnCloudinary }
// // Upload a file to cloudinary
// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });
