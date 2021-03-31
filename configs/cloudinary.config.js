const cloudinary = require('cloudinary').v2;
const { dev } = require('../env.json');

cloudinary.config({
  cloud_name: dev.CLOUDINARY_NAME,
  api_key: dev.CLOUDINARY_API_KEY,
  api_secret: dev.CLOUDINARY_API_SECRET,
});

const uploadSingle = (file) => {
  return new Promise(async (resolve) => {
    try {
      const result = await cloudinary.uploader.upload(file, {
        folder: 'single',
      });

      if (result) {
        require('fs').unlinkSync(file);
        return resolve({
          cloud_id: result.public_id,
          cloud_url: result.secure_url,
        });
      }

      throw new Error('Cannot upload file');
    } catch (error) {
      console.error(error);
      return resolve({});
    }
  });
};

const uploadMultiple = (file) => {
  return new Promise(async (resolve) => {
    try {
      const result = await cloudinary.uploader.upload(file, {
        folder: 'multiple',
      });

      if (result) {
        require('fs').unlinkSync(file);
        return resolve({
          cloud_id: result.public_id,
          cloud_url: result.secure_url,
        });
      }

      throw new Error('Cannot upload file');
    } catch (error) {
      console.error(error);
      return resolve({});
    }
  });
};

module.exports = { uploadSingle, uploadMultiple };
