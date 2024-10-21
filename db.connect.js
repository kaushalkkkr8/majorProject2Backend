const mongo=require('mongoose')

require("dotenv").config()
const mongoUri=process.env.MONGO

const dataConnection=async ()=>{
    try {
        const connection= await mongo.connect(mongoUri)
        if(connection){
            console.log("Connected Successfully");
            
        }
    } catch (error) {
        console.error(error)
    }
}
module.exports={dataConnection}