const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require ('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontend } = require('../helpers/menu-frontend');

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        //Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                message: 'Email no valido'
            })
        }

        //Verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password);
        if( !validPassword ) {
            return res.status(400).json({
                ok: false,
                message: 'Contraseña no valida'
            });
        }

        // Generar un Token -JWT
        const token = await generarJWT( usuarioDB.id );

        res.json({
            ok: true,
            token,
            menu: getMenuFrontend( usuarioDB.role )
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Hable con el administrador'
        })
    }
}


const googleSignIn = async(req, res = response) => {

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify( googleToken );

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if ( !usuarioDB ) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            //Existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        //Guardar en DB
        await usuario.save();

        // Generar un Token -JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            ok: true,
            token,
            menu: getMenuFrontend( usuario.role )
        });
    } catch (error) {
        res.status(401).json({
            ok: false,
            message: 'El token no es correcto'
        });
    }

}

const renewToken = async(req, res = response) => {

    const uid = req.uid;

    // Generar un Token -JWT
    const token = await generarJWT( uid );

    //Obtener el usuario por uid
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        token,
        usuario,
        menu: getMenuFrontend( usuario.role )
    })
}



module.exports = {
    login,
    googleSignIn,
    renewToken
}