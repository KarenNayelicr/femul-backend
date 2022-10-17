const { response } = require("express");
const fs = require('fs');
const path = require('path')
const { query } = require('../../database/conexion');

exports.guardaEvento = async function (req, res = response) {

  try {

    const tokenAuth = req.body.usuario.toUpperCase();//-
    const codigo = req.body.codigo;//-
    const coordinador = req.body.coordinador.toUpperCase();//-
    const costo = req.body.costo;//-
    const tituloEvento = req.body.titulo.toUpperCase();//-
    const tipoEvento = req.body.tipoEvento.toUpperCase();//-
    const lugar = req.body.lugar.toUpperCase(); //-
    const fecha = req.body.fecha;//-
    const hora = req.body.hora;//-
    const pdf = req.body.pdf;//-
    let nombreImg = req.body.nombreImg;//-
    nombreImg = nombreImg.replace(/ /g, "")
    const extensionImg = req.body.extensionImg;//-
    let base64Data = (req.body.previewImage)//-
    //let rutaImg = `http://localhost:3000/api/auth/cargaPhotoEvento/${nombreImg}`
    let rutaImg = `https://app-femulp.herokuapp.com/api/auth/cargaPhotoEvento/${nombreImg}`    



    if (extensionImg === 'jpeg') {
      strImage = base64Data.replace("data:image/jpeg;base64,", "");
    } else if (extensionImg === 'jpg') {
      strImage = base64Data.replace("data:image/jpg;base64,", "");
    } else if (extensionImg === 'png') {
      strImage = base64Data.replace("data:image/png;base64,", "");
    }

    fs.writeFile('public/' + nombreImg, strImage, 'base64', async (err) => {
      if (err) return console.error(err)
      console.log('Archivo guardado con éxito')


      let consulIdUser = await query(`select * from tb_usuarios where correo = '${tokenAuth}';`);

      if (consulIdUser.length >= 1) {

        let idUser = consulIdUser[0].id_user;

        try {
                
        let ingresarEvento = await query(`insert into tb_eventos(codigo, tituloEvento, tipoEvento, coordinador, costo, fecha, hora, lugar, rutaImg, pdf, usuario) values ('${codigo}','${tituloEvento}','${tipoEvento}','${coordinador}','${costo}','${fecha}','${hora}','${lugar}','${rutaImg}','${pdf}','${tokenAuth}')`);

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
    return res.status(400).json({ status: 400, message: e.message });
  }
};


exports.editarEvento = async function (req, res = response) {

  try {
    console.log('ingresa a editar registro');

    const tokenAuth = req.body.usuario.toUpperCase();//-
    const codigo = req.body.codigo;//-
    const coordinador = req.body.coordinador.toUpperCase();//-
    const costo = req.body.costo;//-
    const tituloEvento = req.body.titulo.toUpperCase();//-
    const tipoEvento = req.body.tipoEvento.toUpperCase();//-
    const lugar = req.body.lugar.toUpperCase(); //-
    const fecha = req.body.fecha;//-
    const hora = req.body.hora;//-
    const pdf = req.body.pdf;//-
    const idEvento = Number(req.body.id_evento);//-
    let nombreImg = req.body.nombreImg;//-



    console.log(tokenAuth);
    console.log(codigo);
    console.log(coordinador);
    console.log(costo);
    console.log(tituloEvento);
    console.log(tipoEvento);
    console.log(lugar);
    console.log(fecha);
    console.log(hora);
    console.log(pdf);
    console.log('idEvento: ' + idEvento);


    if (nombreImg != "") {

      nombreImg = nombreImg.replace(/ /g, "")
      const extensionImg = req.body.extensionImg;//-
      let base64Data = (req.body.previewImage)//-
      let rutaImg = `http://localhost:3000/api/auth/cargaPhotoEvento/${nombreImg}`

      if (extensionImg === 'jpeg') {
        strImage = base64Data.replace("data:image/jpeg;base64,", "");
      } else if (extensionImg === 'jpg') {
        strImage = base64Data.replace("data:image/jpg;base64,", "");
      } else if (extensionImg === 'png') {
        strImage = base64Data.replace("data:image/png;base64,", "");
      }

      fs.writeFile('public/' + nombreImg, strImage, 'base64', async (err) => {
        if (err) return console.error(err)
        console.log('Archivo guardado con éxito')


        let editarEvento = await query(`UPDATE tb_eventos SET tituloEvento = '${tituloEvento}', tipoEvento = '${tipoEvento}', coordinador = '${coordinador}', costo = '${costo}', fecha = '${fecha}', hora = '${hora}', lugar = '${lugar}', rutaImg = '${rutaImg}', pdf = '${pdf}', usuario = '${tokenAuth}' WHERE id_evento = ${idEvento};`);

        return res.status(200).json({ code: 200, status: true, message: 'Información Editada con éxito' });

      })

    } else {
      console.log('me ingresa por el else SIN Imagen');

      let editarEvento = await query(`UPDATE tb_eventos SET tituloEvento = '${tituloEvento}', tipoEvento = '${tipoEvento}', coordinador = '${coordinador}', costo = '${costo}', fecha = '${fecha}', hora = '${hora}', lugar = '${lugar}', pdf = '${pdf}', usuario = '${tokenAuth}' WHERE id_evento = ${idEvento}`);

      return res.status(200).json({ code: 200, status: true, message: 'Información Editada con éxito sin imagen' });


    }


  } catch (e) {
    console.log('Ingresa por aca');
    return res.status(400).json({ status: 400, message: e.message });
  }
};


exports.cargaPhotoEvento = async function (req, res = response) {

  try {
    const { id } = req.params;

    let indexPath = path.join(__dirname, '../../public/' + id);

    res.sendFile(indexPath);


  } catch (e) {
    console.log(e);
    return res.status(400).json({ status: 400, message: e.message });
  }
};


exports.cargaEventos = async function (req, res = response) {

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


exports.cargaEventosRegistro = async function (req, res = response) {

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