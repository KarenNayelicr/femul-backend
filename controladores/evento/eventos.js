const { response } = require("express");
const fs = require('fs');
const path = require('path')
const { query } = require('../../database/conexion');

exports.guardaEvento = async function(req, res = response) {

    try {

        const tokenAuth = req.body.usuario.toUpperCase(); //-
        const codigo = req.body.codigo; //-
        const coordinador = req.body.coordinador.toUpperCase(); //-
        const costo = req.body.costo; //-
        const calificacion = req.body.texto; //-
        const tituloEvento = req.body.titulo.toUpperCase(); //-
        const tipoEvento = req.body.tipoEvento.toUpperCase(); //-
        const lugar = req.body.lugar.toUpperCase(); //-
        const fecha = req.body.fecha; //-
        const hora = req.body.hora; //-
        const observacion = req.body.observacion; //-
        const pdf = req.body.pdf; //-
        let nombreImg = req.body.nombreImg; //-
        nombreImg = nombreImg.replace(/ /g, "")
        const extensionImg = req.body.extensionImg; //-
        let base64Data = (req.body.previewImage) //-
            //let rutaImg = `http://localhost:3000/api/auth/cargaPhotoEvento/${nombreImg}`
        let rutaImg = `https://femullapp.onrender.com/api/auth/cargaPhotoEvento/${nombreImg}`



        let consulCodigo = await query(`select * from tb_eventos where codigo = '${codigo}';`);


        if (consulCodigo.length >= 1) {
            return res.status(200).json({ code: 210, status: false, message: 'Código existente' });
        }


        if (extensionImg === 'jpeg') {
            strImage = base64Data.replace("data:image/jpeg;base64,", "");
        } else if (extensionImg === 'jpg') {
            strImage = base64Data.replace("data:image/jpg;base64,", "");
        } else if (extensionImg === 'png') {
            strImage = base64Data.replace("data:image/png;base64,", "");
        }

        fs.writeFile('public/' + nombreImg, strImage, 'base64', async(err) => {
            if (err) return console.error(err)
            console.log('Archivo guardado con éxito')


            let consulIdUser = await query(`select * from tb_usuarios where correo = '${tokenAuth}';`);

            if (consulIdUser.length >= 1) {

                let idUser = consulIdUser[0].id_user;

                try {

                    let ingresarEvento = await query(`insert into tb_eventos(codigo, tituloEvento, tipoEvento, coordinador, costo, fecha, hora, lugar, rutaImg, pdf, calificacion, observacion, usuario) values ('${codigo}','${tituloEvento}','${tipoEvento}','${coordinador}','${costo}','${fecha}','${hora}','${lugar}','${rutaImg}','${pdf}','${calificacion}','${observacion}','${tokenAuth}')`);

                    return res.status(200).json({ code: 200, status: true, message: 'Información guardada con éxito' });

                } catch (e) {
                    fs.unlinkSync('public/' + nombreImg) //Con esto elimino la imagen guardada si hay un registro duplicado
                    console.log('imagen removida');
                    return res.status(200).json({ code: 206, status: false, message: e.message });
                }

            } else {
                return res.status(200).json({ code: 204, status: false, message: 'No existe usuario registrado' });
            }



        })


        /*         console.group('Datos');
                    console.log(tokenAuth);
                    console.log(codigo);
                    console.log(nombreEvento);
                    console.log(fecha);
                    console.log(hora);
                    console.log(nombreImg);
                    console.log(observacion);
                console.groupEnd(); */





    } catch (e) {
        console.log('ingresa al error');
        console.log(e.message)
        return res.status(400).json({ status: 400, message: e.message });
    }
};


exports.editarEvento = async function(req, res = response) {

    try {
        console.log('ingresa a editar registro');

        const tokenAuth = req.body.usuario.toUpperCase(); //-
        const coordinador = req.body.coordinador.toUpperCase(); //-
        const costo = req.body.costo; //-
        const estado = req.body.estado; //-
        const calificacion = req.body.texto; //-
        const tituloEvento = req.body.titulo.toUpperCase(); //-
        const tipoEvento = req.body.tipoEvento.toUpperCase(); //-
        const lugar = req.body.lugar.toUpperCase(); //-
        const fecha = req.body.fecha; //-
        const hora = req.body.hora; //-
        const observacion = req.body.observacion; //-
        const pdf = req.body.pdf; //-
        const idEvento = Number(req.body.id_evento); //-
        let nombreImg = req.body.nombreImg; //-



        /*     console.log(tokenAuth);
            console.log(coordinador);
            console.log(costo);
            console.log(tituloEvento);
            console.log(tipoEvento);
            console.log(calificacion);
            console.log(lugar);
            console.log(fecha);
            console.log(observacion);
            console.log(hora);
            console.log(estado);
            console.log(pdf);
            console.log('idEvento: ' + idEvento); */


        if (nombreImg != "") {

            nombreImg = nombreImg.replace(/ /g, "")
            const extensionImg = req.body.extensionImg; //-
            let base64Data = (req.body.previewImage) //-
                //let rutaImg = `http://localhost:3000/api/auth/cargaPhotoEvento/${nombreImg}`
            let rutaImg = `https://app-femulp.herokuapp.com/api/auth/cargaPhotoEvento/${nombreImg}`

            if (extensionImg === 'jpeg') {
                strImage = base64Data.replace("data:image/jpeg;base64,", "");
            } else if (extensionImg === 'jpg') {
                strImage = base64Data.replace("data:image/jpg;base64,", "");
            } else if (extensionImg === 'png') {
                strImage = base64Data.replace("data:image/png;base64,", "");
            }

            fs.writeFile('public/' + nombreImg, strImage, 'base64', async(err) => {
                if (err) return console.error(err)
                console.log('Archivo guardado con éxito')


                let editarEvento = await query(`UPDATE tb_eventos SET tituloEvento = '${tituloEvento}', tipoEvento = '${tipoEvento}', coordinador = '${coordinador}', costo = '${costo}', fecha = '${fecha}', hora = '${hora}', lugar = '${lugar}', rutaImg = '${rutaImg}', pdf = '${pdf}', estado = '${estado}', calificacion = '${calificacion}', observacion= '${observacion}', usuario = '${tokenAuth}' WHERE id_evento = ${idEvento};`);

                return res.status(200).json({ code: 200, status: true, message: 'Información Editada con éxito' });

            })

        } else {
            console.log('me ingresa por el else SIN Imagen');

            let editarEvento = await query(`UPDATE tb_eventos SET tituloEvento = '${tituloEvento}', tipoEvento = '${tipoEvento}', coordinador = '${coordinador}', costo = '${costo}', fecha = '${fecha}', hora = '${hora}', lugar = '${lugar}', pdf = '${pdf}', estado = '${estado}', calificacion = '${calificacion}', observacion= '${observacion}', usuario = '${tokenAuth}' WHERE id_evento = ${idEvento}`);

            return res.status(200).json({ code: 200, status: true, message: 'Información Editada con éxito sin imagen' });


        }


    } catch (e) {
        console.log('Ingresa por aca');
        return res.status(400).json({ status: 400, message: e.message });
    }
};


exports.eliminarEvento = async function(req, res = response) {

    try {
        console.log('ingresa a eliminar registro');

        const idEvento = Number(req.body.id_evento);
        console.log(idEvento);


        let consulParticipantes = await query(`SELECT * FROM tb_eventos tb_e, tb_gestion tb_g WHERE tb_e.id_evento = tb_g.fk_evento AND tb_e.id_evento = ${idEvento};`);

        if (consulParticipantes.length >= 1) {
            return res.status(200).json({ code: 400, status: false, message: 'Ya existen participantes' });
        } else {
            let eliminar = await query(`DELETE FROM tb_eventos WHERE id_evento = ${idEvento};`)
            return res.status(200).json({ code: 200, status: false, message: 'No existen registro' });
        }


    } catch (e) {
        console.log('Ingresa por aca');
        return res.status(400).json({ status: 400, message: e.message });
    }
};


exports.cargaPhotoEvento = async function(req, res = response) {

    try {
        const { id } = req.params;

        let indexPath = path.join(__dirname, '../../public/' + id);

        res.sendFile(indexPath);


    } catch (e) {
        console.log(e);
        return res.status(400).json({ status: 400, message: e.message });
    }
};


exports.cargaEventos = async function(req, res = response) {

    try {

        let cargaEventos = await query(`select * from tb_eventos;`);

        if (cargaEventos.length >= 1) {
            return res.status(200).json({ code: 200, status: true, message: 'Datos consultados', cargaEventos: cargaEventos });
        } else {
            return res.status(200).json({ code: 204, status: false, message: 'No existe eventos' });
        }

    } catch (e) {
        console.log(e);
        return res.status(400).json({ status: 400, message: e.message });
    }
};


exports.cargaEventosRegistro = async function(req, res = response) {

    try {

        const { id } = req.params;

        let cargaEventos = await query(`select * from tb_eventos where codigo = '${id}';`);

        if (cargaEventos.length >= 1) {
            return res.status(200).json({ code: 200, status: true, message: 'Datos consultados', cargaEvento: cargaEventos });
        } else {
            return res.status(200).json({ code: 204, status: false, message: 'No existe eventos' });
        }

    } catch (e) {
        console.log(e);
        return res.status(400).json({ status: 400, message: e.message });
    }
};


exports.cuentaEventos = async function(req, res = response) {

    try {

        let cargaEventos = await query(`select count(*) as contador from tb_eventos;`);
        let cargaParticipantes = await query(`select count(*) as contador2 from tb_participantes;`);
        let cargaUsuarios = await query(`select count(*) as contador3 from tb_usuarios;`);


        return res.status(200).json({ code: 200, status: true, message: 'Datos consultados', contadorEventos: cargaEventos[0]['contador'], contadorParticipantes: cargaParticipantes[0]['contador2'], contadorUsuario: cargaUsuarios[0]['contador3'] });



    } catch (e) {
        console.log(e);
        return res.status(400).json({ status: 400, message: e.message });
    }
};