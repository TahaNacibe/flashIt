import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  image:{type: String},
  email: { type: String, required: true, unique: true },
  // Add other fields here
}, { timestamps: true });

const User = models.User || model("User", userSchema);
export default User;
