const jwt = require("jsonwebtoken");
const Profile = require("../Model/profileModel");



const authProfile = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Access token required" });

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.profile = await Profile.findById(decode.id);

    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authProfile;
