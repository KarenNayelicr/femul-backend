const { response } = require("express");
var xl = require('excel4node');
const path = require('path')
const { query } = require('../../database/conexion');

exports.reporteExcel = async function (req, res = response) {

    try {

        //http://localhost:3000/api/auth/reporteExcel

        let consulParticipantes = await query(`select * from tb_participantes;`);

        if (consulParticipantes.length >= 1){

            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('ejemplo');

            var style = wb.createStyle({
                font: {
                    bold: true,
                    italics : false,            
                    color: '#FF0800',
                    name: 'Arial',
                    size: 12,
                }    
            });

            var style2 = wb.createStyle({
                font: {
                    italics : false,            
                    color: 'Black',
                    name: 'Arial',
                    size: 12,
                }    
            });            

            ws.cell(4, 1).string("Dni").style(style)
            ws.cell(4, 2).string("Nombres").style(style)
            ws.cell(4, 3).string("Institución").style(style);
            
            
            let i;
            let fila = 5;

            for (i = 0; i < consulParticipantes.length; i++) {

                ws.cell(fila, 1).string(consulParticipantes[i]['dni']).style(style2);
                ws.cell(fila, 2).string(consulParticipantes[i]['nombres']).style(style2);
                ws.cell(fila, 3).string(consulParticipantes[i]['institucion']).style(style2);
        
                //Ancho de las columnas
                ws.column(1).setWidth(30);
                ws.column(2).setWidth(30);

                fila = fila + 1

            }

            const pathExcel = path.join(__dirname, '../../public/reportes/', "Ejemplo.xlsx")

            wb.write(pathExcel, function(err, stats){ 
               if (err) {
                   console.error(err);
               }else{
                   function downloadFile(){
                       res.download(pathExcel);
                   }
                   //Con esto envío a descargar al archivo
                   //downloadFile();
                   //return false;
                   return res.status(200).json({ code: 200, status: true, message: 'Archivo Generado'});
               }
           });             
            
        }


    } catch (e) {
        console.log('ingresa al error');
        console.log(e.message);
        return res.status(400).json({ status: 400, message: e.message });
      }
};        