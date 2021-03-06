const {
  uploadSingle,
  uploadMultiple,
} = require('../configs/cloudinary.config');

const uploadImagesFile = async (files) => {
  if (files && files.length > 0) {
    const imagesPromise = files.map(
      (image) =>
        new Promise(async (resolve) => {
          try {
            const result = await uploadMultiple(image.path);

            if (result) return resolve(result);

            throw new Error('Cannot upload file');
          } catch (error) {
            console.log(error);
          }
        })
    );

    const images = await Promise.all(imagesPromise);

    return images;
  }

  return [];
};

module.exports = { uploadImagesFile };
