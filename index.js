require('dotenv').config();

const express = require('express');
const cors = require('cors')

const  { dbConnection } = require('./db/config');

//Crear servidor de express
const app = express();

//Configurar cors
app.use(cors());

//Base de datos
dbConnection();

//Rutas
app.get('/', (req, res) => {
    res.json({
        ok: true,
        message: 'Hola mundo'
    })
});


app.listen( process.env.PORT, () => {
    console.log('servidor corriendo en puerto: ' + process.env.PORT);
} )