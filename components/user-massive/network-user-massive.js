const express = require("express");
const multer = require("multer");
const csv = require('csvtojson');
const fs = require('fs');

//instance of multiple user creation contoller
const { massive } = require("../../store/firestoreAdmin");

const router = express.Router();

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
}).single("usersCSV");


//HTTP Methods
router.post("/", (req, res, next) => {
  let users;

  upload(req, res, (err) => {
    if(err) {
      res.status(400).json({
        data: err.message,
        message: 'Error: Bad Request',
        result: false
      });
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
          message: "Users created correctly",
          statusCode: res.statusCode
        });
      })
      .catch((err) => {
        res.status(500).json({
          data: err.message,
          status: res.statusCode,
          message: 'An error ocurred during using creation',
        });

        //delete csv file stored previously on tempFiles
        fs.unlink(`tempFiles/${csvfilename}`, (err) => {
          if(err) throw err;
          console.log(`./tempFiles/${csvfilename} was deleted`);
        });

        return next(err);
      }); 

      return users;
    }
  });
});

module.exports = router;
