const { response } = require('express');
const bcrypt = require ('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async(req, res) => {

    const usuarios = await Usuario.find({}, 'nombre email role google');

    res.json({
        ok: true,
        message: 'Obteniendo usuarios...',
        usuarios,
        uid: req.uid
    })
    
}

const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;


    try {

        const existeEmail = await Usuario.findOne({ email });

        if( existeEmail ) {
            return res.status(400).json({
                ok: false,
                message: 'El correo ya existe'
            })
        }

        const usuario = new Usuario( req.body );

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );


        //Guardar usuario
        await usuario.save();
        
        //General el token-JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            message: 'usuario creado',
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error inesperado... Revisar logs'
        })
    }  
    
}

const actualizarUsuario = async (req, res = response) => {

    const uid = req.params.id;

    try {
        //Verificar si un usuario existe
        const usuarioDB = await Usuario.findById( uid );

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                message: 'No existe un usuario con ese ID'
            });
        }

        // Actualizaciones
        const { password, google, email, ...campos} = req.body;

        if ( usuarioDB.email != email ) {

            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    message: 'Ya existe un usuario con ese email'
                });
            }
        }

        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, {new: true});
        
        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Error inesperado'
        })
    }
}

const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id

    try {
        //Verificar si un usuario existe
        const usuarioDB = await Usuario.findById( uid );

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                message: 'No existe un usuario con ese ID'
            });
        }
        
        //Borrar usuario
        await Usuario.findByIdAndDelete( uid );

        res.status(200).json({
            ok: true,
            message: 'Usuario borrado',
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Hable con el administrador'
        });
    }

    
    
}






module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}