import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload a file to cloudinary
const uploadOnCloudinary = async (localFilePath, path = "img") => {
  try {
    //check whether the file exists
    if (!localFilePath) return null;
    // Upload a file
    const response = await cloudinary.uploader.upload(localFilePath, {
      asset_folder: path,
      resource_type: "auto",
    });
    // file uploaded successfully
    // console.log("File uploaded successfully on cloudinary", response);
    fs.unlinkSync(localFilePath); // remove the file from the local storage
    return response; // return the response which contian the url of the uploaded file
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the file from the local storage and it must be done before throwing the error
    return null;
  }
};

const deleteInCloudinary = async (cloudinaryFilePath) => {
  try {
    if (!cloudinaryFilePath) return null;

    const avatarPublicId = cloudinaryFilePath.split("/").pop().split(".")[0];

    const response = await cloudinary.uploader.destroy(`${avatarPublicId}`);

    console.log("Cloudinary delete response:", response);
    return response;
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteInCloudinary };
