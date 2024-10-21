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
      unique:true
    },
    sex: {
      type: String,
    },

    phoneNumber: {
      type: String,
      unique:true
    },
    email: {
      type: String,
      required: true,
      unique:true
    },
    image: {
      type: String,
    },
    coverImage: {
      type: String,
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
        name: String,
        userName: String,
        userImage: String,
      },
    ],
    following: [
      {
        name: String,
        userName: String,
        userImage: String,
      },
    ],

   

    logIn: {
      type: Boolean,
    },
  },
  { timestamps: true }
);
const Profile = mongo.model("Profile", profileSchema);
module.exports = Profile;
