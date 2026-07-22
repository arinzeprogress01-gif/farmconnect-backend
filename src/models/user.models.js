import mongoose from 'mongoose';

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
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        "password must contain at least 8 values with uppercase, lowercase and number"
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

    profileCompleted: {

      type: Boolean,

      default: false,

    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    permissions: {

      admin: {

        type: Boolean,

        default: false,

      },

    },
    passwordReset: {

    otpHash: {

        type: String,

        default: null,

    },

    expiresAt: {

        type: Date,

        default: null,

    },

    attempts: {

        type: Number,

        default: 0,

    },

    verified: {

        type: Boolean,

        default: false,

    },

    createdAt: {

        type: Date,

        default: null,

    },

},

    devices: [

      {

        token: {

          type: String,

          required: true,

        },

        platform: {

          type: String,

          default: "web",

        },

        browser: {

          type: String,

          default: "Unknown",

        },

        lastSeen: {

          type: Date,

          default: Date.now,

        },

      },

    ],

    isSuperAdmin: {

      type: Boolean,

      default: false,

    },

    reservationBlockedUntil: {

      type: Date,

      default: null,

    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;