import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

export function getPublicIdFromUrl(url) {
  if (!url) return null;
  try {
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return null;
    
    let remainingPath = url.substring(uploadIndex + "/upload/".length);
    const parts = remainingPath.split("/");
    
    if (parts[0] && parts[0].startsWith("v") && /^\d+$/.test(parts[0].substring(1))) {
      parts.shift();
    }
    
    let publicPath = parts.join("/");
    const dotIndex = publicPath.lastIndexOf(".");
    if (dotIndex !== -1) {
      publicPath = publicPath.substring(0, dotIndex);
    }
    
    return publicPath;
  } catch (error) {
    console.error("Error parsing Cloudinary URL:", error);
    return null;
  }
}

export default cloudinary