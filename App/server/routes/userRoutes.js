
const express = require("express");
const router = express.Router();
const userController  = require('../controllers/userController.js');



router.get('/:id', async (req,res) => {
  await userController.getUserById(req,res);
});


router.post('/', async (req,res)=>{
    console.log('DEV_MSG: create new user');
    await userController.registerUser(req,res);
});

router.post ('/login', async (req,res) => {
    console.log('DEV_MSG: User Login');
    await userController.loginUser(req,res);
});

module.exports = router;