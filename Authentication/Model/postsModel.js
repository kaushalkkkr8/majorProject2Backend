const mongo = require("mongoose");

const postsSchema = new mongo.Schema(
  {
    posts: {
      type: String,
    },
    // postImage: {
    //   type: String,
    // },
    postImage: [
      {
        imageURL: {
          type: String,
        },
        originalName: {
          type: String,
        },
        mimeType: {
          type: String,
        },
        size: {
          type: Number,
        },
      },
    ],
    user: { type: mongo.Schema.Types.ObjectId, ref: "Profile" },

    comments: [
      {
        user: { type: mongo.Schema.Types.ObjectId, ref: "Profile" },
        comment: String,
      },
    ],

    likes: [
      {
        user: { type: mongo.Schema.Types.ObjectId, ref: "Profile" },
      },
    ],
  },
  { timestamps: true }
);

const Posts = mongo.model("posts", postsSchema);
module.exports = Posts;
