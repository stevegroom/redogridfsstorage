module.exports = function(app) {

  const crypto = require("crypto");
  const path = require("path");
  const mongoose = require("mongoose");
  const multer = require("multer");
  const GridFsStorage = require("multer-gridfs-storage");
 
  // DB
  const mongoURI = 'mongodb://dbuser:pass@0.0.0.0:27017/sro';

  // Connection
  const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  app.locals.conn = conn;
  
  // init GFS
  let gfs;
  conn.once("open", () => {
    //console.log("init the gfs stream"); // init stream
    gfs = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: "uploads"
    });
    app.locals.gfs = gfs;
  });

  // Storage
  const storage = new GridFsStorage({ 
    db: conn,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString("hex") + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads' // The MongoDb collection name
          };
          resolve(fileInfo);
        });
      });
    }  
  });
  app.locals.storage = storage;
    
  const upload = multer({ storage:storage, limits: { fileSize: 10000000} }).single('file');
  app.locals.upload = upload;

}