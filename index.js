const { dataConnection } = require("./db.connect");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const corsOption = {
  origin: "*",
  credential: true,
  optionSuccessStatus: 200,
};

const Posts = require("./Authentication/Model/postsModel");
const Profile = require("./Authentication/Model/profileModel");
const authRouter = require("./Authentication/Routes/authRouter");
const authProfile = require("./Authentication/Routes/profileRouter");
const imageRoute= require("./Authentication/Routes/imageRoutes")
const postRoute= require("./Authentication/Routes/postRoutes")



app.use(cors(corsOption));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
dataConnection();

// const PORT = 3000;
const PORT = 4000;

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// authenticated signup Login****************************************

app.use("/auth", authRouter);
app.use("/profile", authProfile);

app.use("/api/images", imageRoute);


//********************************** **********************

//Adding Post

app.use("/post",postRoute);



app.put("/post/postComents/:id", async (req, res) => {
  const postId = req.params.id;

  const { user, comment } = req.body;

  try {
    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const updatedPost = await Posts.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { user, comment } },
      },
      { new: true }
    );

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/post/deleteComent/:id", async (req, res) => {
  const commentId = req.params.id;
  try {
    const comment = await Posts.findOneAndUpdate({ "comments._id": commentId }, { $pull: { comments: { _id: commentId } } }, { new: true });
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json({
      message: "Comment deleted successfully",
      comment,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/editPost/:id", async (req, res) => {
  const postId = req.params.id;

  const updatedPostData = req.body;

  try {
    const updatedData = await Posts.findByIdAndUpdate(postId, updatedPostData, { new: true });
    if (!updatedData) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/deletePost/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const deleteData = await Posts.findByIdAndDelete(postId);
    if (!deleteData) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({
      message: "Pst deleted successfully",
      post: deleteData,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/post/like/:id", async (req, res) => {
  const postId = req.params.id;

  const { liked } = req.body;
  try {
    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const updatePost = await Posts.findByIdAndUpdate(postId, { $push: { likes: { user: liked } } }, { new: true });
    res.json(updatePost);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/post/like/:id", async (req, res) => {
  const postId = req.params.id;

  const { liked } = req.body;

  try {
    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const updatePost = await Posts.findByIdAndUpdate(postId, { $pull: { likes: { user: liked } } }, { new: true });
    res.json(updatePost);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//PROFILE

app.get("/userProfile", async (req, res) => {
  try {
    // const profiles = await Profile.find().populate("following.user");
    const profiles = await Profile.find();
    if (profiles.length > 0) {
      res.status(201).json(profiles);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.put("/editProfile/:id", async (req, res) => {
//   const profileId = req.params.id;
//   const updateProfile = req.body;
//   try {
//     const profile = await Profile.findByIdAndUpdate(profileId, updateProfile, { new: true });
//     if (!profile) {
//       res.status(404).json({ error: "Profile not found" });
//     }
//     res.status(201).json(profile);
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.put("/profile/follow/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { targetUserId } = req.body;

  try {
    const userProfile = await Profile.findById(userId);
    // const targetProfile = await Profile.findById(targetUserId);

    // if (!userProfile || !targetProfile) {
    if (!userProfile) {
      return res.status(404).json({ error: "User or target profile not found" });
    }

    const updatedUserProfile = await Profile.findByIdAndUpdate(userId, { $addToSet: { following: { user: targetUserId } } }, { new: true });

    const updatedTargetProfile = await Profile.findByIdAndUpdate(targetUserId, { $addToSet: { follower: { user: userId } } }, { new: true });

    res.json({ message: "Follow relationship added successfully", updatedUserProfile, updatedTargetProfile });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/profile/unfollow/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { targetUserId } = req.body;

  try {
    const userProfile = await Profile.findById(userId);

    if (!userProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const updatedUserProfile = await Profile.findByIdAndUpdate(userId, { $pull: { following: { user: targetUserId } } }, { new: true });

    const updatedTargetProfile = await Profile.findByIdAndUpdate(targetUserId, { $pull: { follower: { user: userId } } }, { new: true });

    res.json({ message: "Follow relationship removed successfully", updatedUserProfile, updatedTargetProfile });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/profile/bookmark/:id", async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const updatedProfile = await Profile.findByIdAndUpdate(userId, { $push: { bookmarked: { post: postId } } }, { new: true });

    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/profile/removeBookmark/:id", async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const updatedProfile = await Profile.findByIdAndUpdate(userId, { $pull: { bookmarked: { post: postId } } }, { new: true });

    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log("App is running on port:", PORT);
});
