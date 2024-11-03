const { uploadForProfile } = require("../Middleware/imageUploaderMiddleware");
const authProfile = require("../Middleware/middlewareProfile");
const Profile = require("../Model/profileModel");

const router = require("express").Router();



router.get("/", authProfile, (req, res) => {
  res.status(200).json({ success: true, profile: req.profile });
});


router.put("/editProfile/:id", uploadForProfile, async (req, res) => {
  const profileId = req.params.id;
  const updateProfile =  req.body ;

  try {
    
    
    if (req.files) {
      if (req.files.image) {
        updateProfile.image = req.files.image.map((file) => ({
          mimeType: file.mimetype,
          imageURL: file.path,
          originalName: file.originalname,
          size: file.size,
        }));
      }
      if (req.files.coverImage) {
        updateProfile.coverImage = req.files.coverImage.map((file) => ({
          mimeType: file.mimetype,
          imageURL: file.path,
          originalName: file.originalname,
          size: file.size,
        }));
      }
    }
    const profile = await Profile.findByIdAndUpdate(profileId, updateProfile, { new: true });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(201).json({ success: true, profile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



module.exports = router;
