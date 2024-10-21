const mongo = require("mongoose");

const postsSchema = new mongo.Schema({
  posts: {
    type: String,
  },
  postImage: {
    type: String,
  },
  userName: {
    type: String,
  },
  userImage: {
    type: String,
  },
  nameOfUser: {
    type: String,
  },
  comments: [
    {
      commentName: String,
      commentUserName: String,
      commentUserImage: String,
      comment: String,
    },
  ],
  likes: [String],
  bookmarked:[String]
}, { timestamps: true });

const Posts = mongo.model("posts", postsSchema);
module.exports = Posts;
