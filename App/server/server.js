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
const authRoutes = require('./routes/authRoutes');
//routes end
app.use(cors({
  origin: 'http://localhost:3000', // React app URL
  credentials: true,               // if you need cookies
}));
app.use(express.json());



app.use('/api/users',userRoutes); 
app.use('/api/auth', authRoutes);









app.listen(port, () =>{
    console.log("listening on port: ", port);
})