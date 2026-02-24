import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: [true, "MongoosDB_Err: email already exists."],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: [18, "age must be at least 18 years"],
    max: [60, "age cannot exceed 60 years"],
  },
});

const userModel = mongoose.model("User", userSchema);
export default userModel;
