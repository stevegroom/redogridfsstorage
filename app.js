const express = require("express");
const app = express();

const methodOverride = require('method-override');

// Middleware
app.use(methodOverride('_method'));
app.use(express.json());
app.set("view engine", "ejs");

// DB connection then gridfs
require('./startup/db')(app);

// Application routes
//require('./startup/routes')(app);
const files = require('./routes/files');
app.use('/',files);

// Server
const port = 5000;
app.listen(port, () => {
  console.log("server started on " + port);
});
