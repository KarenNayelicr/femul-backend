const { response } = require("express");
const { query } = require('../database/conexion');

exports.consultasABC = async function (req, res = response) {

    try {      
      const nombre  = req.body.nombre;
      const direccion  = req.body.direccion;
     //Aqui se pone el codigo



    //********INICIO LA TRANSSACION*********/
    await query('START TRANSACTION')

     //let consultaLocales = await query (`select * from t_locales where estado='A';`)
     //let updateRegistro = await query(`UPDATE t_locales SET estado='E' WHERE id_locales=${idLocal} and id_user=${IdUsuario}`);
     //let consultaIdUsers = await query(`SELECT * FROM t_users WHERE phone='${movil}'`)

    
    
     //********FINALIZO TRANSSACION Y LA GUARDO SI TODO ESTA OK*********/
    await query('COMMIT')     

     // return res.status(200).json({ code: 200, status: true, data: response.data });
    } catch (e) {
      /*BORRO LOS REGISTROS PARA QUE NO SE GUARDEN POR EL ERROR */
      await query('ROLLBACK')
      return res.status(400).json({ status: 400, message: e.message });
    }
  };


  exports.consultas123 = async function (req, res = response) {

    try {      
      //Asi recibimos el id como parametro
      const{id} = req.params 
    
    
      //Aqui se pone el codigo


     

     // return res.status(200).json({ code: 200, status: true, data: response.data });
    } catch (e) {
      return res.status(400).json({ status: 400, message: e.message });
    }
  };