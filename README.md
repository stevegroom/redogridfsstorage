# Refactor Multer / GridFS / Mongoose

I wanted to expand my BWP app with the ability to upload
files and store them in the MongoDB.

Came across several examples using Multer / GridFS / Mongoose and ended up following this blog <https://dev.to/shubhambattoo/comment/k8dk>
and forking the repo: <https://github.com/shubhambattoo/node-js-file-upload>

Currently the refactored code works but not synchronously. So the home page is shown before the previous file upload is complete.
