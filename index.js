const { dataConnection } = require("./db.connect");
const express = require("express");
const cors = require("cors");

const Posts = require("./postsModel");
const Profile = require("./profileModel");

const corsOption = {
  origin: "*",
  Credential: true,
  optionSuccessStatus: 200,
};
const app = express();
app.use(cors(corsOption));
app.use(express.json());
dataConnection();

app.get("/", (req, res) => {
  res.send("Hello, Express!");
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log("App is running on port:", PORT);
});

//Adding Post

app.post("/post", async (req, res) => {
  const { posts, postImage, nameOfUser, userName, userImage } = req.body;
  try {
    const newPosts = new Posts({ posts, postImage, nameOfUser, userName, userImage });
    await newPosts.save();
    res.status(201).json(newPosts);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/post/postComents/:id", async (req, res) => {
  const postId = req.params.id;

  const { commentName, commentUserName, commentUserImage, comment } = req.body;

  try {
    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const updatedPost = await Posts.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { commentName, commentUserName, commentUserImage, comment } },
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

app.get("/fetchPost", async (req, res) => {
  try {
    const allPosts = await Posts.find();
    res.json(allPosts);
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

//Add BookMark
app.post("/post/bookmark/:id", async (req, res) => {
  const postId = req.params.id; // ID of the post to be bookmarked
  const { bookmarked } = req.body; // The username of the person bookmarking the post

  try {
    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const updatedPost = await Posts.findByIdAndUpdate(
      postId,
      { $push: { bookmarked } }, // Push username to bookmarked array
      { new: true } // Return updated document
    );

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/post/removeBookmark/:id", async (req, res) => {
  const postId = req.params.id; // ID of the post to remove bookmark from
  const { bookmarked } = req.body; // Username to be removed from the bookmark list

  try {
    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const updatedPost = await Posts.findByIdAndUpdate(
      postId,
      { $pull: { bookmarked: bookmarked } }, // Pull the username from the bookmarked array
      { new: true } // Return updated document
    );

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/post/like/:id", async (req, res) => {
  const postId = req.params.id;
  console.log("delete like id", postId);

  const { liked } = req.body;
  try {
    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const updatePost = await Posts.findByIdAndUpdate(postId, { $push: { likes: liked } }, { new: true });
    res.json(updatePost);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/post/like/:id", async (req, res) => {
  const postId = req.params.id;

  const { liked } = req.body;
  console.log("delete like obj", liked);

  try {
    const post = await Posts.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const updatePost = await Posts.findByIdAndUpdate(postId, { $pull: { likes: liked } }, { new: true });
    res.json(updatePost);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//PROFILE

app.post("/signUp", async (req, res) => {
  const { name, userName, email, sex, password } = req.body;
  try {
    const existingUserName = await Profile.findOne({ userName });
    if (existingUserName) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const existingEmail = await Profile.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const newProfile = new Profile({ name, userName, email, sex, password, logIn: false });
    newProfile.save();
    res.status(201).json(newProfile);
  } catch (error) {
    //copied from internet

    if (error.name === "MongoError" && error.code === 11000) {
      // Handle the MongoDB uniqueness error
      const duplicateKey = Object.keys(error.keyValue)[0];
      res.status(400).json({
        error: `${duplicateKey.charAt(0).toUpperCase() + duplicateKey.slice(1)} already exists.`,
      });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.get("/profile", async (req, res) => {
  try {
    const profiles = await Profile.find();
    if (profiles.length > 0) {
      res.status(201).json(profiles);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/editProfile/:id", async (req, res) => {
  const profileId = req.params.id;
  const updateProfile = req.body;
  try {
    const profile = await Profile.findByIdAndUpdate(profileId, updateProfile, { new: true });
    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
    }
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.delete("/deleteProfile/:id", async (req, res) => {
//   const profileId = req.params.id;
//   try {
//     const deleteData = await Posts.findByIdAndDelete(profileId);
//     if (!deleteData) {
//       return res.status(404).json({ error: "Profile not found" });
//     }
//     res.status(200).json({
//       message: "Profile deleted successfully",
//       Profile: deleteData,
//     });
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

app.put("/profile/addFollowing/:id", async (req, res) => {
  const userId = req.params.id;
  const { name, userName, userImage } = req.body;
  try {
    const userProfile = await Profile.findById(userId);
    if (!userProfile) {
      return res.status(404).json({ error: "profile not found" });
    }

    const updatedProfile = await Profile.findByIdAndUpdate(
      userId,
      {
        $push: { following: { name, userName, userImage } },
      },
      { new: true }
    );

    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.put("/profile/addFollower/:id", async (req, res) => {
  const userId = req.params.id;
  const { name, userName, userImage } = req.body;
  try {
    const userProfile = await Profile.findById(userId);
    if (!userProfile) {
      return res.status(404).json({ error: "profile not found" });
    }

    const updatedProfile = await Profile.findByIdAndUpdate(
      userId,
      {
        $push: { follower: { name, userName, userImage } },
      },
      { new: true }
    );

    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.delete("/profile/removeFollower/:id", async (req, res) => {
  const followerId = req.params.id;
  try {
    const profile = await Profile.findOneAndUpdate({ "follower._id": followerId }, { $pull: { follower: { _id: followerId } } }, { new: true });

    if (!profile) {
      return res.status(404).json({ error: "Follower not found" });
    }

    res.status(200).json({
      message: "Follower deleted successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.delete("/profile/removeFollowing/:id", async (req, res) => {
  const followingId = req.params.id;

  try {
    const deleteData = await Profile.findOneAndUpdate({ "following._id": followingId }, { $pull: { following: { _id: followingId } } }, { new: true });
    if (!deleteData) {
      return res.status(404).json({ error: "Following not found" });
    }
    res.status(200).json({
      message: "Following deleted successfully",
      deleteData,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
