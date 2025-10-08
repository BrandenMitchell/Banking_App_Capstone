const {userData} = require('../db/users.js');
const bcrypt = require("bcrypt");         // Handle data encryption 
const { randomUUID }  = require('crypto'); // generate user Id's


const express = require("express");
const router = express.Router();


router.get('/', (req,res)=>{
    console.log('gets all users');
    res.send(userData); //send all user data to front end
});


router.get('/:id', (req,res) => {
    console.log('Get a user by ID');
    const id = parseInt(req.params.id); //get the users id from the front end
    const user = userData.find(u => u.id === id);
    if (!user){
      res.status(404).json({message: "user not found"});  
    }
    const userInfo = {
      id: id,
      username: user.username, 
      email: user.email,
    };
    res.status(201).json(userInfo);
});


router.post('/', async (req,res)=>{
    console.log('DEV_MSG: create new user');
    const saltRounds = 10;    
    //we take in the information
    //hash it with salt
    //Store it in db
    
    try {
      const {username, email, password} = req.body;
      console.log('DEV_MSG: Received body:', req.body);
      if (!username || !email || !password) {
        return res.status(400).json({message: 
          "Missing User Credentials"
        });
      }
      //check if user already is in DB
      const existingUser = userData.find( u => (u.username === username ||  u.email === email));
      if (existingUser) {
        return res.status(409).json({message: "These credentials have already been used to create an account, please try Loggin in"});
      }
      //if user does not exist then we good to continue
      const hashedPass = await bcrypt.hash(password, saltRounds);

      const newUser = {id: randomUUID() ,username: username, email: email, password: hashedPass};
      userData.push(newUser);
      return res.status(201).json({message: "User Created Successfully"});

    } catch (err) {
      console.error('DEV_MSG_SERVER_ERR: ', err);
      return res.status(500).json({ message: "Server error" }); 
    }

});

router.post ('/login', async (req,res) => {
  //we already should have the information hashed in our database
  //so we can just compare the plaintext pass with the hashed pass 
    
    try {
    console.log('DEV_MSG: User Login');
    const { username, email, password } = req.body;
    console.log('DEV_MSG: Received body:', req.body);

    if (!username || !email || !password) {
      console.log("DEV_MSG: Missing Login Credentials");
      return res.status(400).json({ message: "Missing Credentials" });
    }
    //find the user in the database
    const user = userData.find(u =>
      (u.username === username || u.email === email)
    );
    if (!user) return res.status(404).json({ message: "No user found with those credentials" });
    
    const passwordMatches = await bcrypt.compare(password, user.password); // check if the plain text pass matches hashed pass
    if (passwordMatches) {
      //handle login jwt session HERE
      return res.status(201).json({message: "Login Successful"});
    }
    else  {
      return res.status(401).json({message: "login failed, password does not match"});
    }

  } catch (err) {
    console.error('DEV_MSG_SERVER_ERR: ', err);
    return res.status(500).json({ message: "Server error" });
  }
    
});

module.exports = router;