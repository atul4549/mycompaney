import { model, Schema } from "mongoose";

const NameSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-zA-Z0-9_.]+$/,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
      validate: {
        validator: function (password) {
          if (
            this.isModified("password") &&
            password &&
            !password.startsWith("$2a$")
          ) {
            const validation = SecurityUtils.validatePassword(password);
            return validation.success;
          }
          return true;
        },
        message: function (props) {
          if (props.value && !props.value.startsWith("$2a$")) {
            const validation = SecurityUtils.validatePassword(props.value);
            // ["Password is required", "Password must contain at least one uppercase letter"]
            // "Password is required. Password must contain at least one uppercase letter."
            return validation.errors.join(". ");
          }
          return "Password validation failed";
        },
      },
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    email: {
      type: String,
      // required: [true, "Email is required"],
      // unique: true,
      // lowercase: true,
      // trim: true,
      // match: [
      //   /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      //   "Please enter a valid email",
      // ],
    },
    profilePicture: {
      type: String,
      default: "",
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    phone: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    address: {
      street: { type: String, default: "" },
      suite: { type: String, default: "" },
      city: { type: String, default: "" },
      zipcode: { type: String, default: "" },
    },
    company: {
      name: { type: String, default: "" },
      catchPhrase: { type: String, default: "" },
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot be more than 500 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  },
);

export const Name = model("User1", NameSchema);
