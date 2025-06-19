import { ImageIcon, XIcon } from "lucide-react";
import React from "react";

const ImageInput = ({
  image,
  previewUrl,
  clearImage,
  fileInputRef,
  onImageChange,
}) => {
  return (
    <div className="border rounded-lg border-dashed border-gray-300 relative cursor-pointer hover:border-gray-400 transition px-3">
      {image ? (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full max-h-[500px] object-contain rounded-lg"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75 cursor-pointer"
            aria-label="Remove image"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center h-64 cursor-pointer text-gray-400 text-center"
        >
          <ImageIcon className="w-12 h-12 mb-3" />
          <span className="text-lg mx-auto ">
            Drag photos and videos here or click to browse
          </span>
          <p className="text-sm text-gray-400 mt-2">JPEG, PNG up to 5MB</p>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*"
            onChange={onImageChange}
            ref={fileInputRef}
          />
        </label>
      )}
    </div>
  );
};

export default ImageInput;
