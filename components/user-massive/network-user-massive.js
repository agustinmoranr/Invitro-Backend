const express = require("express");
const { massive } = require("../../store/firestoreAdmin");
const router = express.Router();
const multer = require("multer");
const csv = require('csvtojson');
const fs = require('fs');

const csvfilename = `Users-${Date.now()}.csv`;
  
  // define name and path where storage csv document
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "tempFiles");
    },
    filename: function (req, file, cb) {
      cb(null, csvfilename);
    },
  });

  // Define the maximum size for uploading
  const maxSize = 500 * 1024; //500 Kbytes

  // Request file options
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

        // converts a csv file to JSON by file path. 
        csv()
        .fromFile(`./tempFiles/${csvfilename}`)

        //Build users
        .then(async (json) => {
          users = await massive.insertUsers(json);

          // delete csv file stored previously on tempFiles
          fs.unlink(`tempFiles/${csvfilename}`, (err) => {
            if(err) throw err;
            console.log(`./tempFiles/${csvfilename} was deleted`);
          });

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
