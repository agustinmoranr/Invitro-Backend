const multer = require("multer") 
const fs = require("fs")
const csv =require('csvtojson')

function upload(){

    const csvfilename = `Users-${Date.now()}.csv`
    var storage = multer.diskStorage({ 
        destination: function (req, file, cb) { 
      
            // Uploads is the Upload_folder_name 
            cb(null, "temp") 
        }, 
        filename: function (req, file, cb) { 
          cb(null, csvfilename) 
        } 
      }) 
           
    // Define the maximum size for uploading 
    const maxSize = 1e6; 
        
    var uploadFile = multer({  
        storage: storage, 
        limits: { fileSize: maxSize }, 
        
    }).single("usersdata");     
    
    return uploadFile
}


module.exports = upload()