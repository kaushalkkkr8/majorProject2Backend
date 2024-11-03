

const uploadImages=async(req,res)=>{
    console.log("======uploaded files", req.files);
    res.status(200).json({
        message: "File Uploaded successfully",
        success: true,
        data: req.files,
      });
}


module.exports={uploadImages}



