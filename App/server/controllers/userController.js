// // Handles db query's and user Related Logic

// const User= require('../models/User.js');
// const jwt = require('jsonwebtoken'); //for auth shit


// const getUserById = async (req, res) => {
//     const id = req.params.id;
//     const user = await User.findOne({id});
//     if (!user) {
//         return res.status(404).json({message: "user not found with that ID"});
//     }
//     return res.status(200).json({
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         fullName: user.fullName,
//     });
// };


// const registerUser = async (req, res) => { 
//     try {
//     const {fullName, username, email, password, phoneNumber, street, city, zip, state} = req.body;
//     const userData = {fullName, username, email, password, phoneNumber, street, city, zip, state};
//     const missingFields = Object.entries(userData)
//     .filter(
//         ([key,value]) => value === undefined || value === null || value === "");
//     if(missingFields.length > 0 ) {
//         return res.status(400).json({message: `Missing data fields: ${missingFields.map( f => f[0]).join(",")}` });
//     }

//     //if we have all the fields check if the user exist in db 
//     const existingUser = await User.findOne({email});
//     if (existingUser) {
//         return res.status(409).json({message: "There is already a user with these credentials, Please try loggin in"});
//     }
//     const newUser = await User.create({fullName, username, email,password, phoneNumber,address: {street, city, zip, state}});
//     res.status(201).json({
//         id: newUser.id,
//         username: newUser.username,
//         email: newUser.email
//     });
//     } catch(error) {
//         if (error.name === 'ValidationError') {

//             const messages = Object.values(error.errors).map(err => err.message);
//             return res.status(400).json({message: "validation Failed",
//                 errors: messages
//             });
//         }
//     }
    
    
// };

// const loginUser = async (req, res) => {
//     const {username, email, password} = req.body;

//     if ((!username && !email) || !password) {
//         return res.status(400).json({message:"Missing Information"});
//     }
//     const userData = email 
//         ?await User.findOne({email})
//         : await User.findOne({username});

//     if (!userData) {
//         return res.status(404).json({message: "User not found under that email"});
//     }
//     const passwordIsMatch = await userData.matchPassword(password);

//     if (!passwordIsMatch) {
//         return res.status(401).json({message: "Password does not match that username or email"});
//     }
//     return res.status(200).json({
//         message:"successful Login",
//         id: userData.id, 
//         username: userData.username, 
//         email: userData.email
//         //token when auth setup. 
//     });
    
// };

// module.exports = { getUserById, registerUser, loginUser };


// controllers/userController.js

//what should this controller do? 
    //this controller should check if the user is logged in and valid and use that information to allow things like updating settings, getting information, generating profile etc. 
    //no auth should actually be done here, all in auth js




const User = require('../models/User');

const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
};


//TO-DO: deliver more information for the profile, like bank acc info
const getProfile = async (req, res) => {
    res.json(req.user); //req.user from the middleware
};


// Example update route
const updateUser = async (req, res) => {
    const updates = req.body;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
        message: 'User updated',
        user
    });
};




module.exports = { getUserById, updateUser, getProfile };
