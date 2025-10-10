//ENTRY POINT FOR BACKEND SERVER
const port = 3001;
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/dbConfig.js");
const cors = require('cors');
const app = express();

dotenv.config(); //load in .env variables
connectDB();



//routes here
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./middleware/auth');
//routes end
app.use(cors());
app.use(express.json());
app.use('/api/users',userRoutes); //use userRoutes when accessing api/user/
app.use('/api/auth', authRoutes);









app.listen(port, () =>{
    console.log("listening on port: ", port);
})