function normalizeCloudName(value) {
  const trimmedValue = String(value || "").trim();
  const cloudinaryUrlMatch = trimmedValue.match(/res\.cloudinary\.com\/([^/]+)/);

  if (cloudinaryUrlMatch?.[1]) {
    return cloudinaryUrlMatch[1];
  }

  return trimmedValue
    .replace(/^https?:\/\//, "")
    .replace(/^res\.cloudinary\.com\//, "")
    .split("/")[0]
    .trim();
}

async function uploadImageToCloudinary(file) {
  const cloudName = normalizeCloudName(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
  const uploadPreset = String(
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ""
  ).trim();

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to .env."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "dailee");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    let message = "Cloudinary upload failed.";
    try {
      const errorData = await response.json();
      message = errorData?.error?.message || message;
      if (message.toLowerCase().includes("unknown api key")) {
        message =
          "Cloudinary cloud name looks incorrect. Use your Cloud name, not API Key, and restart the dev server.";
      }
    } catch {
      message = `${message} Check your cloud name and unsigned upload preset.`;
    }
    throw new Error(message);
  }

  const data = await response.json();
  return {
    publicId: data.public_id,
    url: data.secure_url,
  };
}

export { uploadImageToCloudinary };
