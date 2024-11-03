const joi = require("joi");

const signUpValidation = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().min(3).max(100).required(),
    email: joi.string().email().required(),
    userName: joi.string().min(3).max(100).required(),
    sex: joi.string().min(3).required(),
    password: joi.string().min(3).max(100).required(),
  });
  const {error}= schema.validate(req.body)
  if (error) {
    return res.status(400).json({ message: "Bad request", error })
  }
  next()
};

const logInValidation = (req,res,next)=>{
  const schema=joi.object({
    email:joi.string().email().required(),
    password:joi.string().min(3).max(100).required()
  })
  const { error } = schema.validate(req.body);
  if (error) {
    res.json({ error: "Bad Request",error });
  }
  next();
}


module.exports={signUpValidation,logInValidation}