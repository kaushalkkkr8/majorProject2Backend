const { signUp, logIn } = require("../Controller/controllerAuthSingnup")
const { signUpValidation, logInValidation } = require("../Middleware/middlewareAuthValidation")

const router= require("express").Router()

router.post("/signUp",signUpValidation,signUp)
router.post("/logIn",logInValidation,logIn)

module.exports=router