const { response } = require("express");
const { query } = require('../database/conexion');
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

exports.consultasABC = async function (req, res = response) {

  try {

    /*  1LETRAS Y DEMAS NUMEROS   
        let mensaje = 'Y1567';
        let response;
        var reg = new RegExp("^[A-Z][0-9]+$");
        if (mensaje.match(reg)){
          response = "El formato es el correcto";
        } else {
          response = "El formato es incorrecto";
        }
        console.log(response); */


    const CLIENTD_ID = "996651747696-i6pqfo3kri3dushdta7hb6ptspbj121e.apps.googleusercontent.com";
    const CLIENT_SECRET = "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";
    const REDIRECT_URI = "https://developers.google.com/oauthplayground";
    const REFRESH_TOKEN = "1//045hdCuFvj_c5CgYIARAAGAQSNwF-L9IrpkJAdEKAUhGPZZCGcwQgMOpPq9_hMUJvnw9pqgdA1DL1FE8v0oDCgYsnqHKNysLIwXE";



    const oAuth2Client = new google.auth.OAuth2(
      CLIENTD_ID,
      CLIENT_SECRET,
      REDIRECT_URI
    );

    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


    async function sendMail() {

      const accessToken = await oAuth2Client.getAccessToken();
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "p3drovidal06@gmail.com",
          clientId: CLIENTD_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken
        }
      });


      const mailOptions = {
        from: "Pagina web Nodemailer <p3drovidal06@gmail.com>",
        to: "p3drovidal@gmail.com",
        subject: "Nodemailer prueba",
        html: `<h1>Hoooooola</h1>`
      };

      const result = await transporter.sendMail(mailOptions);
      return result;


    }


  sendMail()
   .then((result) => res.status(200).send("enviado"))
   .catch((error) => console.log(error.message));



  } catch (e) {
    /*BORRO LOS REGISTROS PARA QUE NO SE GUARDEN POR EL ERROR */
    await query('ROLLBACK')
    return res.status(400).json({ status: 400, message: e.message });
  }
};





exports.consultas123 = async function (req, res = response) {

  try {
    //Asi recibimos el id como parametro
    const { id } = req.params


    //Aqui se pone el codigo




    // return res.status(200).json({ code: 200, status: true, data: response.data });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};