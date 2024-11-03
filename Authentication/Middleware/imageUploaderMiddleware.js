const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "myGallary",
    format: async (req, file) => "png",
    public_id: (req, file) => file.originalname.split(".")[0] + "",
  },
});
const cloudinaryUploader=multer({storage:storage})
const uploadMultiple=cloudinaryUploader.array("image",10)
const uploadForProfile = cloudinaryUploader.fields([
  { name: "image", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
]);
module.exports={uploadMultiple,uploadForProfile}