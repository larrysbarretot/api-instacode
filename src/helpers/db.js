const mongoose = require('mongoose');
require('dotenv').config();

const urlDb = process.env.MONGO_URI;

const connectDb = async () => {
    try {
        const db = await mongoose.connect(urlDb, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const { name, host } = db.connection;
        console.log(`Conectado a: ${name} ${host}`);
    } catch (error) {
        console.error(`Error de conexión a la DB ${error}`);
    }
}

module.exports = { connectDb };