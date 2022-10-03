const fs=require("fs");

const deleteFile=(filePath)=>{//to delete file
    fs.unlink(filePath,(err)=>{
        if(err)
        {
            throw (err); 
        }
    });
}

exports.deleteFile=deleteFile; 