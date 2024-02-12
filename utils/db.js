const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://admin-aakash:HcAjpLuBAPHl8B1d@cluster0.wes5x3j.mongodb.net/todoDB';

const connectDB = async () => {
    try {   
        await mongoose.connect(mongoDB)
        console.log("Connected Successfully to DB")
    } catch (error) {
        console.error(error)
        process.exit(0)
    }
}

module.exports = connectDB