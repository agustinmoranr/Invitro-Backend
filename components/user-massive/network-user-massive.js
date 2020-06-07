const express = require("express");
const { massive } = require("../../store/firestore");
const router = express.Router();
const multer = require("multer") 
const fs = require("fs")
const csv=require('csvtojson')

router.post("/", create);

async function create(req, res, next) {
  const csvfilename = `Users-${Date.now()}.csv`;
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Uploads is the Upload_folder_name
      cb(null, "temp");
    },
    filename: function (req, file, cb) {
      cb(null, csvfilename);
    },
  });

  // Define the maximum size for uploading
  const maxSize = 1e6;

  var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
  }).single("usersdata");

  upload(req, res, function (err) {
      const converter = csv()
        .fromFile(`./temp/${csvfilename}`)
        .then((json) => {
          res.send(massive.insertUsers(json));
          fs.unlinkSync(`./temp/${csvfilename}`);
        });
      console.log("llego aca", converter);
  });
}

module.exports = router;
