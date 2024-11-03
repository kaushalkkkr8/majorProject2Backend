const Posts = require("../Model/postsModel");

const addPost = async (req, res) => {
  try {
    console.log("======uploaded files", req.files);
    const postImages = req.files.map((file) => ({
      mimeType: file.mimetype,
      imageURL: file.path,
      originalName: file.originalname,
      size: file.size,
    }));

    const { posts, user } = req.body;

    const newPost = new Posts({
      posts,
      postImage: postImages,
      user,
    });

    await newPost.save();

    res.status(201).json({
      message: "Post created successfully",
      success: true,
      data: newPost,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      err: err.message,
    });
  }
};



const getAllPost= async(req,res)=>{
    try {
        // const allPosts = await Posts.find().populate("comments.user");
        const allPosts = await Posts.find();
        res.json(allPosts);
      } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
      }
}

module.exports={addPost,getAllPost}