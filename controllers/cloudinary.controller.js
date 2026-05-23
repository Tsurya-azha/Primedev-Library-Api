import cloudinary from "../configs/cloudinary.config.js";

export const getFileUrl = (publicId) => {
  return cloudinary.v2.url(publicId);
}

export const uploadFile = async (
  file,
  options = {
    folder: 'library-api/book/covers', // Dikembalikan untuk cover buku
  },
) => {
  try {
    const result = await cloudinary.v2.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
      options,
    );
    return result;
  } catch (error) {
    // Tampilkan error asli di terminal agar mudah di-debug
    console.error('Detail Error Upload Cloudinary:', error.message || error);
    throw error;
  }
}

export const deleteFile = async (publicId) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Detail Error Delete Cloudinary:', error.message || error);
    throw error;
  }
}