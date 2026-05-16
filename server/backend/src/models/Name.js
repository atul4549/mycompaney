import { model, Schema } from "mongoose";

const NameSchema = new Schema({
   username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_.]+$/
  },
  name: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export const Name = model("Namev1", NameSchema);