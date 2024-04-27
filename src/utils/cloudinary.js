import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// import { asyncHandler } from "./asyncHandler";





console.log(cloudinary.config().cloud_name);




const uploadOnCloudinary = async (localFilePath) => {


    try {
        console.log("Uploading file to cloudinary")
        console.log(localFilePath)
        
        const response = await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"});
        console.log("response")
        if(response){
            console.log("File uploaded to cloudinary successfully");
        }
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.log("Error uploading file to cloudinary",error);
        fs.unlinkSync(localFilePath);
        return null;
    }
};
const destroyFromCloudinary  = async(publicId) => {
    try {
        const response = await cloudinary.uploader.destroy(publicId);
        if(response){
            console.log("File deleted from cloudinary successfully");
            return response;
        }
    } catch (error) {
        console.log("Error deleting file from cloudinary");
        return null;
        
    }
}
        

export { uploadOnCloudinary,
    destroyFromCloudinary
};
// // Upload a file to cloudinary
// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });
