const mongoose = require('mongoose')

const { Schema } = mongoose


const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
