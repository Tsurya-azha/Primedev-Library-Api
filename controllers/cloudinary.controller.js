import cloudinary from "../configs/cloudinary.config.js";
import logger from '../configs/pino.config.js'

export const getFileUrl = (publicId) => {
  return cloudinary.v2.url(publicId);
}

export const uploadFile = async (
  file,
  options = {
    folder: 'library-api/book/covers',
  },
) => {
  try {
    const result = await cloudinary.v2.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
      options,
    );
    return result;
  } catch (error) {
    logger.error(error, 'Detail Error Upload Cloudinary')
    throw error;
  }
}

export const deleteFile = async (publicId) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    return result;
  } catch (error) {
    logger.error(error, 'Detail Error Delete Cloudinary')
    throw error;
  }
}