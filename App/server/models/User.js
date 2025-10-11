//Mongoose User Schema and Model Definition

const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // to create hashing and comparison funcs directly in model
const { randomUUID }  = require('crypto'); 



const userSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => randomUUID(),
        unique: true
    },
    fullName: {
        type: String, 
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true, 
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true, 
        trim: true,
        unique: true,
        lowercase: true 
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        trim: true,
        required: true,
        match: [/^\+?[0-9\s\-()]{10,20}$/ , "Invalid phone number"] //regex "validation"
    },
    address: {
        street: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        zip: { type: String, required: true, trim: true }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//helper functions 

//preSave for hasing passwords so that we never put in plaintxt passwords
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
});

//function to check if a plaintxt password matches one in the db
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password); //where this is the instance of current user. 
};




//create the mongoose user class
const User = mongoose.model("User",userSchema);

module.exports = User;

