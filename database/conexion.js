/* eslint-disable */
const mysql = require('mysql');

 
const pool = mysql.createPool({
        
        //INSTANCIA NUEVA SUBIDA 2022
        host:'51.222.156.196',
        user:'jubonesn_karen',
        password:'Hola2022**',
        database:'jubonesn_femulp'


})
 
 
exports.query = function( sql, values ) {
     // devolver una promesa
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {
 
          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
                     // finaliza la sesión
          connection.release()
        })
      }
    })
  })
}
 