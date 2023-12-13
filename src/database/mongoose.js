const mongoose = require('mongoose');
require('dotenv').config();

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            minPoolSize: 2,
            maxPoolSize: 10
    });
        console.log(`Database is connected!`);
    } catch (error) {
        console.error(`Cannot connect to database!`, error.message);
        process.exit(1); // Exit the process if unable to connect
    }
};

module.exports = connectToDatabase;
