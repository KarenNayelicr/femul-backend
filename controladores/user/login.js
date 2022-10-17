const { response } = require("express");
const { query } = require('../../database/conexion');

exports.loginIngreso = async function (req, res = response) {

    try {
        
        const correo  = req.body.email;
        const password  = req.body.password;

        console.log('correo: ' + correo);
        console.log('password: ' + password);

        let consulUser = await query(`select * from tb_usuarios where correo = '${correo}';`);
        //console.log(consulUser);

        if (consulUser.length >= 1) {

            let estado = Number(consulUser[0].estado)
            let nombre = consulUser[0].nombres
            let datos = (consulUser[0].contrasena);
            console.log('estado: ' + estado);

            if (estado === 0) {
                console.log('Me ingresa al false');
                return res.status(200).json({ code: 206, message: `Usuario inactivo ${nombre}` });
            }

            
            if (datos === password) {
                console.log('La contraseña es igual');
                console.log('contraseña: ' + datos);

                return res.status(200).json({ code: 200, message: `Ingreso exitoso` });

            } else {

                return res.status(200).json({ code: 204, message: `Password incorrecta` });

            }


        }else{

            return res.status(200).json({ code: 208, message: `Usuario no existe` });
        }

        //hacer la consulta a la db
        //retornamos la respuesta al frond



    } catch (error) {
        


        
    }


}


exports.sesionActiva = async function (req, res = response) {

    try {
        console.log('ingrese a sesion activa');
        const tokenAuth = req.body.tokenAuth;

        console.log('tokenAuth: ' + tokenAuth);

        let consulSesion = await query(`select * from tb_usuarios where correo = '${tokenAuth}';`);

        if (consulSesion.length >= 1) {
            let estado = consulSesion[0].estado;
            let nombre = consulSesion[0].nombres;
            let rol = consulSesion[0].rol;

            return res.status(200).json({ code: 200, estado: estado, nombre: nombre, rol: rol });
        } else {
            return res.status(200).json({ code: 204, estado: estado, nombre: nombre, rol: rol });
        }

        console.log(tokenAuth);

        //Aqui se pone el codigo



        // return res.status(200).json({ code: 200, status: true, data: response.data });
    } catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};