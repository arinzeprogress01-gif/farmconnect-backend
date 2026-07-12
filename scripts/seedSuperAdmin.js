import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

import User from "../src/models/user.models.js";

import { hashPassword } from "../src/utils/password.utils.js";

await mongoose.connect(process.env.MONGODB_URI);

const existingAdmin = await User.findOne({

    isSuperAdmin: true,

});

if (existingAdmin) {

    console.log("Super Admin already exists.");

    process.exit();

}

const password = await hashPassword("Admin@123");

await User.create({

    fullName: "System Administrator Higgs",

    email: "arinzeporgress01@gmail.com",

    phone: "09023339055",

    password,

    role: "user",

    profileCompleted: true,

    permissions: {

        admin: true,

    },

    isSuperAdmin: true,

});

console.log("Super Admin created.");

process.exit();