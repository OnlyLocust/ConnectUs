import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

export function getPublicIdFromUrl(url) {
  try {
    const parts = url.split("/");
    const filename = parts[parts.length - 1]; 
    const publicId = filename.split(".")[0];   
    return publicId;
  } catch {
    return null;
  }
}

export default cloudinary