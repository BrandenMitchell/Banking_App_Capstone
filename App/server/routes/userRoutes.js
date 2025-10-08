const express = require("express");
const router = express.Router();


router.get('/', (req,res)=>{
    console.log('gets all users');
})


router.get('/:id', (req,res) => {
    console.log('Get a user by ID');

})


router.post('/', (req,res)=>{
    console.log('create new user');
})

module.exports = router;