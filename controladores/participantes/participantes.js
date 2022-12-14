const { response } = require("express");
const { query } = require('../../database/conexion');
const { sendMail } = require("../../notificaciones/CorreoUserRegistro/correoRegistroUser")

exports.agregarParticipantes = async function (req, res = response) {

    try {

        const nombres = req.body.nombres.toUpperCase();
        const dni = req.body.dni;
        const institucion = req.body.municipalidad.toUpperCase();
        const distrito = req.body.distrito.toUpperCase();
        const provincia = req.body.provincia.toUpperCase();
        const region = req.body.region.toUpperCase();
        const cargo = req.body.cargo;
        const email = req.body.email;
        const movil = req.body.movil;
        const telefono = req.body.telefono;
        const codigoEvento = Number(req.body.id);
        let idParticipante = "";

         console.group('Datos recibidos')
            console.log('nombres: ' + nombres);
            console.log('dni: ' + dni);
            console.log('institucion: ' + institucion);
            console.log('distrito: ' + distrito);
            console.log('provincia: ' + provincia);
            console.log('region :' + region);
            console.log('cargo: ' + cargo);
            console.log('email: ' + email);
            console.log('movil: ' + movil);
            console.log('telefono: ' + telefono);
            console.log('codigoEvento: ' + codigoEvento);    
        console.groupEnd(); 
        
        //********INICIO LA TRANSSACION*********/
        await query('START TRANSACTION')
        let consulEvento = await query(`select * from tb_eventos where codigo = ${codigoEvento};`);
        //console.log(consulEvento);
        let idEvento = consulEvento[0]['id_evento'];
        let titulo = consulEvento[0]['tituloEvento'];
        let tipoEvento = consulEvento[0]['tipoEvento'];
        let lugar = consulEvento[0]['lugar'];
        let fecha = consulEvento[0]['fecha'];
        let hora = consulEvento[0]['hora'];        

        let consulParticipantes = await query(`select * from tb_participantes where dni = '${dni}';`);

        if (consulParticipantes.length >= 1){
            idParticipante = Number(consulParticipantes[0].id_participante);
            console.log('El id participantes existente es: ' + idParticipante);
            let updateParticipantes = await query(`UPDATE tb_participantes SET institucion = '${institucion}', distrito = '${distrito}', region = '${region}', provincia = '${provincia}', cargo = '${cargo}', email = '${email}', movil = '${movil}', telefono = '${telefono}' WHERE dni = ${dni};`);

        }else{

            let aggParticipante = await query(`insert into tb_participantes(dni, nombres, institucion, distrito, region, provincia, cargo, email, movil, telefono) values ('${dni}', '${nombres}', '${institucion}', '${distrito}', '${region}', '${provincia}', '${cargo}', '${email}', '${movil}', '${telefono}')`);

            let extraeUltParticipante = await query(`select * from tb_participantes order by id_Participante desc limit 1;`);
            idParticipante = Number(extraeUltParticipante[0]['id_participante']);
            console.log('El id participantes nuevo es: ' + idParticipante);

        }

        let consulEventoInscrito = await query(`select * from tb_gestion where fk_participante = ${idParticipante} AND fk_evento = ${idEvento};`);

        //console.log(consulEventoInscrito);

        if(consulEventoInscrito.length >= 1){
            console.log('Ya se encuentra inscrito al evento');
            return res.status(200).json({ code: 206, status: false, message: 'Ya se encuentra inscrito al evento'});
        }else{

            let aggGestion = await query(`insert into tb_gestion(fk_participante, fk_evento) values (${idParticipante}, ${idEvento})`);
                    
            //********FINALIZO TRANSSACION Y LA GUARDO SI TODO ESTA OK*********/
            await query('COMMIT')
            //console.log(idEvento);


            await sendMail(email, nombres, titulo, tipoEvento, lugar, fecha, hora);            

            return res.status(200).json({ code: 200, status: true, message: 'Informaci??n guardada con ??xito'});

            }
    } catch (e) {
        console.log('ingresa al error');
        console.log(e.message);
        /*BORRO LOS REGISTROS PARA QUE NO SE GUARDEN POR EL ERROR */
        await query('ROLLBACK')
        return res.status(400).json({ status: 400, message: e.message });
      }
};



exports.consultarParticipantes = async function (req, res = response) {

    try {
        const{dni} = req.params 
        //console.log(dni);

        let consulParticipantes = await query(`select * from tb_participantes where dni = '${dni}';`);

        if (consulParticipantes.length >= 1){
            return res.status(200).json({ code: 200, status: true, message: 'Informaci??n consultada con ??xito', participantes: consulParticipantes });
        }else{
            return res.status(200).json({ code: 204, status: true, message: 'Informaci??n consultada con ??xito', participantes: '' });
        }

    } catch (e) {
        console.log('ingresa al error');
        return res.status(400).json({ status: 400, message: e.message });
      }
}; 