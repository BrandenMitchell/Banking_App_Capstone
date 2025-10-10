//MongoDB configuration and connection File
const mongoose = require("mongoose");



const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI , {
            useNewUrlParser:true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${connect.connection.host}`);

    } catch (error) {
        console.error(`Error connection to MongoDB: ${error.message}`);
        process.exit(1); //exit if we cant connect
    }
};


module.exports = connectDB; 
