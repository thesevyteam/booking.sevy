const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const multerUpload = multer({
  storage: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
      if (file.fieldname === "service_images") {
        return {
          folder: "sevy/service_images",
          allowed_formats: ["jpg", "png", "jpeg"],
        };
      }
    },
  }),
}).fields([{ name: "service_images", maxCount: 8 }]);

module.exports = {
  multerUpload,
};
