const { uploadImages } = require("../Controller/imageControler");
const { uploadMultiple } = require("../Middleware/imageUploaderMiddleware");

const Routes= require("express").Router()


Routes.post("/imageUpload",uploadMultiple,uploadImages)


module.exports = Routes;