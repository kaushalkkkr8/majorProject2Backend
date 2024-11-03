const mongo = require("mongoose");

const profileSchema = new mongo.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    userName: {
      type: String,
      required: true,
      unique: true,
    },
    sex: {
      type: String,
    },

    phoneNumber: {
      type: String,
    
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image:
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
    
    coverImage: 
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
    

    password: {
      type: String,
    },
    dob: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    bio: {
      type: String,
    },
    profession: {
      type: String,
    },
    maritialStatus: {
      type: String,
    },
 

    follower: [
      {
        user:{type:mongo.Schema.Types.ObjectId,ref:"Profile"}
      },
    ],
    following: [
      {
        user:{type:mongo.Schema.Types.ObjectId,ref:"Profile"}
      },
    ],

    bookmarked: [
      {
        post: { type: mongo.Schema.Types.ObjectId, ref: "posts" },
      },
    ],

  },
  { timestamps: true }
);
const Profile = mongo.model("Profile", profileSchema);
module.exports = Profile;
