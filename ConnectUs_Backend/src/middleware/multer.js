import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit size to 5MB
  },
  fileFilter: (req, file, cb) => {
    // Only accept common image mime types
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/jpg"];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, WEBP, GIF and JPG images are allowed."), false);
    }
  },
});

export default upload;