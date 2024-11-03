const Profile = require("../Model/profileModel");
const bcrypt= require("bcrypt")
const jwt= require('jsonwebtoken')



const signUp = async (req, res) => {
    try {
        const { name, userName, email, sex, password } = req.body;
      const existingUserName = await Profile.findOne({ userName });
      if (existingUserName) {
        return res.status(409).json({ error: "Username already exists",success: false });
      }
  
      const existingEmail = await Profile.findOne({ email });
      if (existingEmail) {
        return res.status(409).json({ error: "Email already exists",success: false });
      }
     

      const hashedPassword = await bcrypt.hash(password, 10);
      const newProfile = new Profile({ name, userName, email, sex, password:hashedPassword});
      newProfile.save();
      res.status(201).json({ message: "SignUp successfully", success: true, newProfile });
    }  catch (error) {
        res.status(500).json({ error: "Internal serverError" });
      }
  };



  const logIn=async (req,res)=>{
    try{
      const {email,password}=req.body
      const profile= await Profile.findOne({email})
      
      const err="Authentication failed"
      if(!profile){
        return res.status(409).json({ error: err,success: false });
      }
      const isPassword= await bcrypt.compare(password,profile.password)
      if (!isPassword) {
        return res.status(409).json({ message: err, success: false });
      }
   
      // const token=  jwt.sign({profile},process.env.JWT_SECRET,{expiresIn:"24h"})
      const token = jwt.sign({ id: profile._id }, process.env.JWT_SECRET, { expiresIn: "24h" });

      
      res.status(200).json({ message: "Login successfully", success: true, token})
    }catch(error){
      res.status(500).json({ error: "Internal serverError" });
    }
  }
  module.exports={signUp,logIn}


