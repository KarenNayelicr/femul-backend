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

                ws.cell(fila, 1).string(consulParticipantes[i]['Dni']).style(style2);
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

exports.reporteExcelEventos = async function (req, res = response) {

    try {


        let consulEventos = await query(`select tb_e.codigo, tb_e.tituloEvento, tb_e.tipoEvento, tb_e.costo, tb_e.fecha, tb_e.hora, tb_e.lugar, 
        tb_e.rutaImg, tb_e.pdf, tb_e.estado, tb_e.calificacion, tb_e.observacion, tb_e.fechRegistro 
        from tb_eventos tb_e;`);

        if (consulEventos.length >= 1){

            var wb = new xl.Workbook();
            
            var options = {
                margins: {
                    left: 0.2,
                    right: 0.2
                },
                pageSetup: {
                    orientation: 'landscape' //Pongo la hoja horizontal
                },
                printOptions: {
                    centerHorizontal: true,
                    centerVertical: false,

                }
            }

            var ws = wb.addWorksheet('Hola', options)

            var styleEncabezado = wb.createStyle({
                font: {
                    bold: true,
                    italics : false,            
                    color: '#FF0800',
                    name: 'Arial',
                    size: 16,
                    
                },
            //Con esto centro la informacion y la alineo verticalmente
             alignment: { 
                    horizontal: 'center',
                    vertical: 'center'
                },
                //Con esto pinto las celdas
                fill: {
                    type: 'pattern', // the only one implemented so far.
                    patternType: 'solid', // most common.
                    fgColor: '98EB52', //verde
                }
            });

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

            ws.cell(1, 1, 2, 13, true).string("Registro de Eventos").style(styleEncabezado);
            //ws.cell(1, 3, 1, 4, true).string("Merge Cell B").style(style);

            ws.cell(4, 1).string("Código").style(style);
            ws.cell(4, 2).string("Título").style(style);
            ws.cell(4, 3).string("Tipo de Evento").style(style);;
            ws.cell(4, 4).string("Coordinador").style(style);
            ws.cell(4, 5).string("Precio").style(style);
            ws.cell(4, 6).string("Fecha").style(style);
            ws.cell(4, 7).string("Hora").style(style);
            ws.cell(4, 8).string("Lugar").style(style);
            ws.cell(4, 9).string("Imagen").style(style);
            ws.cell(4, 10).string("Pdf").style(style);
            ws.cell(4, 11).string("Estado").style(style);
            ws.cell(4, 12).string("Calificación").style(style);
            ws.cell(4, 13).string("Observación").style(style);             
            
            
            let i;
            let fila = 5;

            for (i = 0; i < consulEventos.length; i++) {

                ws.cell(fila, 1).string(consulEventos[i]['codigo']).style(style2);
                ws.cell(fila, 2).string(consulEventos[i]['tituloEvento']).style(style2);
                ws.cell(fila, 3).string(consulEventos[i]['tipoEvento']).style(style2);
                ws.cell(fila, 4).string(consulEventos[i]['coordinador']).style(style2);
                ws.cell(fila, 5).string(consulEventos[i]['costo']).style(style2);
                ws.cell(fila, 6).string(consulEventos[i]['fecha']).style(style2);
                ws.cell(fila, 7).string(consulEventos[i]['hora']).style(style2);
                ws.cell(fila, 8).string(consulEventos[i]['lugar']).style(style2);                
                ws.cell(fila, 9).link((consulEventos[i]['rutaImg']), 'rutaImagen', 'AppFemul.com')                
                ws.cell(fila, 10).link((consulEventos[i]['pdf']), 'rutaPdf', 'AppFemul.com')
                ws.cell(fila, 11).string(consulEventos[i]['estado']).style(style2);
                ws.cell(fila, 12).string(consulEventos[i]['calificación']).style(style2);
                ws.cell(fila, 13).string(consulEventos[i]['observacion']).style(style2);

        
                //Ancho de las columnas
                ws.column(2).setWidth(30);
                ws.column(3).setWidth(30);
                ws.column(4).setWidth(40);
                ws.column(12).setWidth(80);
                ws.column(13).setWidth(80);

                fila = fila + 1

            }

            const pathExcel = path.join(__dirname, '../../public/reportes/', "reporteEventos.xlsx")

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