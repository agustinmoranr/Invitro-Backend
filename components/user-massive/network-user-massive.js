const express = require("express");
const { massive } = require("../../store/firestore");
const router = express.Router();
const multer = require("multer");
const csv = require('csvtojson');

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

  router.post("/", (req, res, next) => {
    let users;
    upload(req, res, (err) => {
      if(err) {
        return next(err);
      } else {
        csv()
        .fromFile(`./temp/${csvfilename}`)
        .then(async (json) => {
          users = await massive.insertUsers(json);

          //fs.unlinkSync(`../../temp/${csvfilename}`);
          return res.status(201).json({
            data: users,
            message: "Users created correctly"
          });
        })
        .catch((err) => {
          return console.log(err.message);
        }); 
        return users;
      }
    });
  });

module.exports = router;
