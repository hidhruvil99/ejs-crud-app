const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const path = require('path');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, 'public')));

mongoose
  .connect("mongodb://127.0.0.1:27017/usersdb")
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.error(err));

const userRoute = require("./router/userRoute");
app.use("/", userRoute); 
 

app.listen(3000, () => {
  console.log("Server running on port 3000"); 
});