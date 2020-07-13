const express = require('express');
const bodyParser = require('body-parser'); 

const files = require('../routes/files');

console.log('Setting up routes in startup/routes.js');

module.exports = function(app) {
  
  app.use('/', files);
  
  }
  // // for parsing application/json
  // app.locals.bodyParser = bodyParser;
  // app.use(bodyParser.json()); 
  
  // // for parsing application/xwww-forms
  // app.use(bodyParser.urlencoded({ extended: true })); 
  // //form-urlencoded
  
  // for parsing multipart/form-data
  //const upload = app.locals.upload;
  //console.log("Multer upload array", upload);
//  console.log("upload.array()", upload.array());

// https://github.com/expressjs/multer/issues/690 
// upload.array() is a catch all - don't use if poss.
//  app.use(upload.array()); 

//  app.use(express.static('public'));
  
//  app.use(express.json());

