const { addPost, getAllPost } = require("../Controller/postController");
const { uploadMultiple } = require("../Middleware/imageUploaderMiddleware");

const Routes = require("express").Router();

Routes.post("/", uploadMultiple, addPost);
Routes.get("/", getAllPost);

// Routes.put("/editPost/:id", uploadMultiple, async (req, res) => {
//   const {id} = req.params.id;
//   const updatedPostData = req.body;

//   try {
//     if (req.files && req.files.image) {
//       const images = req.files.image.map((file) => ({
//         mimeType: file.mimetype,
//         imageURL: file.path,
//         originalName: file.originalname,
//         size: file.size,
//       }));
//       updatedPostData.image = images;
//     }

//     const updatedData = await Posts.findByIdAndUpdate(id, updatedPostData, { new: true });
//     if (!updatedData) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     res.status(200).json(updatedData);
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// Routes.put("/editPost/:id", async (req, res) => {
//     const postId = req.params.id;

//     const updatedPostData = req.body;

//     try {
//       const updatedData = await Posts.findByIdAndUpdate(postId, updatedPostData, { new: true });
//       if (!updatedData) {
//         return res.status(404).json({ message: "Post not found" });
//       }
//       res.status(200).json(updatedData);
//     } catch (error) {
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   });

module.exports = Routes;
