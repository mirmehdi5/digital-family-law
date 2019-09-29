const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const DataSchema = new Schema({
  username: String,
  email: String,
  password: String
});

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Userprofile", DataSchema, "userprofile");
