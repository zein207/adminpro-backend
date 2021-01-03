const { response } = require('express')
const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {

    const medicos = await Medico.find()
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre');

    res.json({
        ok: true,
        medicos
    })
}

const getMedicoById = async(req, res = response) => {

    const id = req.params.id;

    try {
        const medico = await Medico.findById(id)
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre');

        res.json({
            ok: true,
            medico
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            message: 'Hable con el administrador'
        })
    }

    
}

const crearMedico = async(req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });


    try {

        const medicoDB = await medico.save();


        res.json({
            ok: true,
            medico: medicoDB
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: 'Error inesperado'
        })
    }
}

const actualizarMedico = async(req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const medico = await Medico.findById(id);

        if ( !medico ) {
            res.status(404).json({
                ok: true,
                message: 'Medico no encontrado'
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true});

        res.json({
            ok: true,
            medico: medicoActualizado
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            message:'Hable con el administrador'
        });
    }
}

const borrarMedico = async(req, res = response) => {

    const id = req.params.id;

    try {

        const medico = await Medico.findById(id);

        if ( !medico ) {
            res.status(404).json({
                ok: true,
                message: 'Medico no encontrado'
            });
        }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            message: 'Medico eliminado'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            message:'Hable con el administrador'
        });
    }
}






module.exports = {
    getMedicos,
    getMedicoById,
    crearMedico,
    actualizarMedico,
    borrarMedico
}