const mongoose = require('mongoose')

const dbConnection = async () => {

    try {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Conexion con la base de datos establecida');
    } catch (error) {
        console.log(error);
        throw new Error('Error al contectar con la base de datos');
    }

    
}

module.exports = {
    dbConnection
}