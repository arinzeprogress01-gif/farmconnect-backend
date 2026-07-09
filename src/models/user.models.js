import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      minlength: 4,
      maxLength: 30,
      trim: true,
      match: [
            /^[a-zA-Z\s'-]+$/,
            "Name can only contain letters, spaces, hyphens and apostrophes"
        ]
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
            /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
            "Please fill a valid email address , example: user@example.com"
        ]
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength : 128,
      select: false,
      match : [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;,
        "password msut contain at least 8 values with uppercase, lowercase and number"
      ]
    },

    role: {
      type: String,
      enum: ["user", "vendor"],
      required: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;