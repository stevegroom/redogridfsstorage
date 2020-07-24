const express = require('express');
const app = express.Router();
const mongoose = require('mongoose');
const util = require('util');

//const config = require('config');

// @route GET / 
// @desc Loads form
app.get('/', (req, res) => {
  gfs = req.app.locals.gfs;
  if(!gfs) {
    console.log('some error occurred, check connection to db');
    res.send('some error occurred, check connection to db');
    process.exit(0);
  }
  gfs.find().toArray((err, files) => {
    // check if files
    if (!files || files.length === 0) {
      return res.render('index', {
        files: false
      });
    } else {
      const f = files
        .map(file => {
          if (
            file.contentType === 'image/png' ||
            file.contentType === 'image/jpeg'
          ) {
            file.isImage = true;
          } else {
            file.isImage = false;
          }
          return file;
        })
        .sort((a, b) => {
          return (
            new Date(b['uploadDate']).getTime() -
            new Date(a['uploadDate']).getTime()
          );
        });

      return res.render('index', {
        files: f
      });
    }

    // return res.json(files);
  });
});

// TODO - async fix needed
//https://stackoverflow.com/questions/45540560/node-js-multer-upload-with-promise 
// Currently file upload completes AFTER redirect to home page :-( 

// @route POST /upload
// @desc Uploads file to DB
app.post('/upload',

  (req,res,next) => {

    console.log('@route POST /upload body',req.body);
    console.log('First /upload middleware - upload single file:', "upload");
    //app.use('/upload',req.app.locals.upload.single('file'));
    const upload = req.app.locals.upload;
    console.log("Upload is:", upload);
    upload(req, res, function (err) {
      if (err) {
        console.log("Error", err); // An error occurred when uploading 
        return
      }
      // Everything went fine 
      next();
    })
  }, 
  (req, res, next) => {

    console.log('Second /upload middleware - the redirect');
    //res.json({file : req.body});
    res.redirect('/');
    next();

  }
);

// @route GET /files
// @desc Display all files in JSON
app.get('/files', (req, res) => {
  gfs = req.app.locals.gfs;
  gfs.find().toArray((err, files) => {
    // check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'no files exist'
      });
    }

    return res.json(files);
  });
});

// @route GET /files/:filename
// @desc Display single file object
app.get('/files/:filename', (req, res) => {
  gfs = req.app.locals.gfs;
  gfs.find(
    {
      filename: req.params.filename
    },
    (err, file) => {
      if (!file) {
        return res.status(404).json({
          err: 'no file exists'
        });
      }

      return res.json(file);
    }
  );
});

// @route GET /files/:filename
// @desc Display Image
app.get('/image/:filename', (req, res) => {
  // console.log('id', req.params.id)
  gfs = req.app.locals.gfs;
  const file = gfs
    .find({
      filename: req.params.filename
    })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'no files exist'
        });
      }
      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    });
});

// @route DELETE /files/del/:id
// @desc Delete chunks from the db
app.delete('/files/:id', (req, res) => {
  gfs = req.app.locals.gfs;
  gfs.delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
    if (err) return res.status(404).json({ err: err.message });
    res.redirect('/');
  });
});

module.exports = app;