//ENTRY POINT FOR BACKEND SERVER
const port = 3001;
const express = require("express");
const app = express();
const cors = require('cors');

//routes here
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth');
//routes end
app.use(express.json);
app.use('/api/users',userRoutes); //use userRoutes when accessing api/user/
app.use('/api/auth', authRoutes);









app.listen(port, () =>{
    console.log("listening on port: ", port);
})