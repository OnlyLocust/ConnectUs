export function getPublicIdFromUrl(url) {
  if (!url) return null;

  try {
    const uploadIndex = url.indexOf("/upload/");

    if (uploadIndex === -1) return null;

    let remainingPath = url.substring(
      uploadIndex + "/upload/".length
    );

    const parts = remainingPath.split("/");

    if (
      parts[0] &&
      parts[0].startsWith("v") &&
      /^\d+$/.test(parts[0].substring(1))
    ) {
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