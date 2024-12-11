import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    console.log("Cloudinary upload start");

    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // File has been uploaded successfully
    console.log("File has been uploaded successfully", response.url);

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log("Cloudianry upload failed", err);
    fs.unlinkSync(localFilePath);
  }
};

const deleteInCloudinary = async (fileUrl) => {
  try {
    if (!fileUrl) return null;

    const publicId = extractPublicId(fileUrl);
    if (!publicId) return null;

    let resourceType = "image";
    if (fileUrl.match(/\.(mp4|mkv|mov|avi)$/)) {
      resourceType = "video";
    } else if (fileUrl.match(/\.(mp3|wav)$/)) {
      resourceType = "raw"; // For audio or other file types
    }

    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return res;
  } catch (err) {
    return null;
  }
};

export { uploadOnCloudinary, deleteInCloudinary };
