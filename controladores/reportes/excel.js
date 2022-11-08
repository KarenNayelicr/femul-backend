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

            var ws = wb.addWorksheet('Reporte Eventos', options)

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
            
            //Ancho de las columnas
            ws.column(2).setWidth(30);
            ws.column(3).setWidth(30);
            ws.column(4).setWidth(40);
            ws.column(6).setWidth(25);
            ws.column(12).setWidth(80);
            ws.column(13).setWidth(80);
            
            
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
                ws.cell(fila, 9).link((consulEventos[i]['rutaImg']), 'rutaImagen', 'AppFemul.com');
                ws.cell(fila, 10).link((consulEventos[i]['pdf']), 'rutaPdf', 'AppFemul.com')
                ws.cell(fila, 11).string(consulEventos[i]['estado']).style(style2);
                ws.cell(fila, 12).string(consulEventos[i]['calificación']).style(style2);
                ws.cell(fila, 13).string(consulEventos[i]['observacion']).style(style2);

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
                   downloadFile();
                   return false;
                   //return res.status(200).json({ code: 200, status: true, message: 'Archivo Generado'});
               }
           });             
            
        }


    } catch (e) {
        console.log('ingresa al error');
        console.log(e.message);
        return res.status(400).json({ status: 400, message: e.message });
      }
};


exports.reporteExcelParticipantes = async function (req, res = response) {

    try {


        let consulParticipantes = await query(`select * from tb_participantes;`);

        if (consulParticipantes.length >= 1){

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

            ws.cell(1, 1, 2, 11, true).string("Registro de Participantes").style(styleEncabezado);
            //ws.cell(1, 3, 1, 4, true).string("Merge Cell B").style(style);

            ws.cell(4, 1).string("Dni").style(style);
            ws.cell(4, 2).string("Nombres").style(style);
            ws.cell(4, 3).string("Institución").style(style);;
            ws.cell(4, 4).string("Distrito").style(style);
            ws.cell(4, 5).string("Región").style(style);
            ws.cell(4, 6).string("Provincia").style(style);
            ws.cell(4, 7).string("Cargo").style(style);
            ws.cell(4, 8).string("Email").style(style);
            ws.cell(4, 9).string("Movil").style(style);
            ws.cell(4, 10).string("Teléfono").style(style);
            ws.cell(4, 11).string("Fecha de registro").style(style);
            
            //Ancho de las columnas   
            ws.column(1).setWidth(25);
            ws.column(2).setWidth(45);
            ws.column(3).setWidth(30);
            ws.column(4).setWidth(30);
            ws.column(5).setWidth(30);
            ws.column(6).setWidth(30);
            ws.column(7).setWidth(35);
            ws.column(8).setWidth(35);
            ws.column(9).setWidth(30);
            ws.column(10).setWidth(30);
            ws.column(11).setWidth(40);
            
            
            let i;
            let fila = 5;

            for (i = 0; i < consulParticipantes.length; i++) {

                ws.cell(fila, 1).string(consulParticipantes[i]['dni']).style(style2);
                ws.cell(fila, 2).string(consulParticipantes[i]['nombres']).style(style2);
                ws.cell(fila, 3).string(consulParticipantes[i]['institucion']).style(style2);
                ws.cell(fila, 4).string(consulParticipantes[i]['distrito']).style(style2);
                ws.cell(fila, 5).string(consulParticipantes[i]['region']).style(style2);
                ws.cell(fila, 6).string(consulParticipantes[i]['provincia']).style(style2);
                ws.cell(fila, 7).string(consulParticipantes[i]['cargo']).style(style2);
                ws.cell(fila, 8).string(consulParticipantes[i]['email']).style(style2);                
                ws.cell(fila, 9).link(consulParticipantes[i]['movil']).style(style2); 
                ws.cell(fila, 10).link(consulParticipantes[i]['telefono']).style(style2); 
                ws.cell(fila, 11).string((consulParticipantes[i]['fechRegistro']).toLocaleString()).style(style2);

                fila = fila + 1

            }

            const pathExcel = path.join(__dirname, '../../public/reportes/', "reporteParticipantes.xlsx")

            wb.write(pathExcel, function(err, stats){ 
               if (err) {
                   console.error(err);
               }else{
                   function downloadFile(){
                       res.download(pathExcel);
                   }
                   //Con esto envío a descargar al archivo
                   downloadFile();
                   return false;
                   //return res.status(200).json({ code: 200, status: true, message: 'Archivo Generado'});
               }
           });             
            
        }


    } catch (e) {
        console.log('ingresa al error');
        console.log(e.message);
        return res.status(400).json({ status: 400, message: e.message });
      }
};


exports.reporteExcelGeneral = async function (req, res = response){
    try {

        let consulDetallado = await query(`SELECT tb_e.codigo, tb_e.tituloEvento, tb_p.nombres as participante, tb_e.tipoEvento, tb_e.coordinador, tb_e.costo, tb_e.fecha, tb_e.hora, tb_e.lugar, 
        tb_e.rutaImg, tb_e.pdf, tb_e.estado, tb_e.calificacion, tb_e.observacion, tb_e.fechRegistro as eventoRegistrado, tb_e.usuario, 
        tb_p.institucion, tb_p.distrito, tb_p.region, tb_p.provincia, tb_p.cargo, tb_p.email, tb_p.movil, tb_p.telefono, tb_p.fechRegistro as fechaRegistro
        FROM tb_eventos tb_e, tb_participantes tb_p, tb_gestion tb_g 
        WHERE tb_e.id_evento = tb_g.fk_evento AND tb_p.id_participante = tb_g.fk_participante;`)

        if (consulDetallado.length >= 1){

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

            ws.cell(1, 1, 2, 24, true).string("Registro de Eventos").style(styleEncabezado);

            ws.cell(4, 1).string("Código").style(style);
            ws.cell(4, 2).string("Titulo del evento").style(style);
            ws.cell(4, 3).string("Participante").style(style);
            ws.cell(4, 4).string("Tipo de evento").style(style);
            ws.cell(4, 5).string("Coordinador").style(style);
            ws.cell(4, 6).string("Precio").style(style);
            ws.cell(4, 7).string("Fecha del evento").style(style);
            ws.cell(4, 8).string("Hora").style(style);
            ws.cell(4, 9).string("Lugar").style(style);
            ws.cell(4, 10).string("Ruta Imagen").style(style);
            ws.cell(4, 11).string("Ruta Pdf").style(style);
            ws.cell(4, 12).string("Estado").style(style);
            ws.cell(4, 13).string("Calificación").style(style);
            ws.cell(4, 14).string("Observación").style(style);
            ws.cell(4, 15).string("Fecha del registro").style(style);
            ws.cell(4, 16).string("Institución").style(style);
            ws.cell(4, 17).string("Distrito").style(style);
            ws.cell(4, 18).string("Región").style(style);
            ws.cell(4, 19).string("Provincia").style(style);
            ws.cell(4, 20).string("Cargo").style(style);
            ws.cell(4, 21).string("Email").style(style);
            ws.cell(4, 22).string("Movil").style(style);
            ws.cell(4, 23).string("Teléfono").style(style);
            ws.cell(4, 24).string("Registro del participante").style(style);
            
            //Ancho de las columnas
            ws.column(2).setWidth(30);
            ws.column(3).setWidth(40);
            ws.column(4).setWidth(20);
            ws.column(5).setWidth(35);
            ws.column(7).setWidth(20);
            ws.column(10).setWidth(15);
            ws.column(11).setWidth(15);
            ws.column(13).setWidth(25);
            ws.column(14).setWidth(30);
            ws.column(15).setWidth(20);
            ws.column(16).setWidth(35);
            ws.column(17).setWidth(20);
            ws.column(18).setWidth(20);
            ws.column(19).setWidth(20);
            ws.column(20).setWidth(20);
            ws.column(21).setWidth(35);
            ws.column(22).setWidth(20);
            ws.column(23).setWidth(20);
            ws.column(24).setWidth(20);
            


            let i;
            let fila = 5;

            for (i = 0; i < consulDetallado.length; i++) {
                ws.cell(fila, 1).string(consulDetallado[i]['codigo']).style(style2);
                ws.cell(fila, 2).string(consulDetallado[i]['tituloEvento']).style(style2);
                ws.cell(fila, 3).string(consulDetallado[i]['participante']).style(style2);
                ws.cell(fila, 4).string(consulDetallado[i]['tipoEvento']).style(style2);
                ws.cell(fila, 5).string(consulDetallado[i]['coordinador']).style(style2);
                ws.cell(fila, 6).string(consulDetallado[i]['costo']).style(style2);
                ws.cell(fila, 7).string(consulDetallado[i]['fecha']).style(style2);
                ws.cell(fila, 8).string(consulDetallado[i]['hora']).style(style2);
                ws.cell(fila, 9).string(consulDetallado[i]['lugar']).style(style2);                
                ws.cell(fila, 10).link((consulDetallado[i]['rutaImg']), 'rutaImagen', 'AppFemul.com');                
                ws.cell(fila, 11).link((consulDetallado[i]['pdf']), 'rutaPdf', 'AppFemul.com');
                ws.cell(fila, 12).string(consulDetallado[i]['estado']).style(style2);
                ws.cell(fila, 13).string(consulDetallado[i]['calificacion']).style(style2);
                ws.cell(fila, 14).string(consulDetallado[i]['observacion']).style(style2);
                ws.cell(fila, 15).string((consulDetallado[i]['eventoRegistrado']).toLocaleString()).style(style2);
                ws.cell(fila, 16).string(consulDetallado[i]['institucion']).style(style2);
                ws.cell(fila, 17).string(consulDetallado[i]['distrito']).style(style2);
                ws.cell(fila, 18).string(consulDetallado[i]['region']).style(style2);
                ws.cell(fila, 19).string(consulDetallado[i]['provincia']).style(style2);
                ws.cell(fila, 20).string(consulDetallado[i]['cargo']).style(style2);
                ws.cell(fila, 21).string(consulDetallado[i]['email']).style(style2);
                ws.cell(fila, 22).string(consulDetallado[i]['movil']).style(style2);
                ws.cell(fila, 23).string(consulDetallado[i]['telefono']).style(style2);
                ws.cell(fila, 24).string((consulDetallado[i]['fechaRegistro']).toLocaleString()).style(style2);

                fila = fila + 1

            }

            const pathExcel = path.join(__dirname, '../../public/reportes/', "reporteDetallado.xlsx")

            wb.write(pathExcel, function(err, stats){ 
               if (err) {
                   console.error(err);
               }else{
                   function downloadFile(){
                       res.download(pathExcel);
                   }
                   //Con esto envío a descargar al archivo
                   downloadFile();
                   return false;
                   //return res.status(200).json({ code: 200, status: true, message: 'Archivo Generado'});
               }
           });            




        }        

    } catch (e) {
        console.log('ingresa al error');
        console.log(e.message);
        return res.status(400).json({ status: 400, message: e.message });
      }        
}




//Solo es el detallado, envia el json al frond
exports.reporteDetallado = async function (req, res = response) {
    try {

        let consulDetallado = await query(`SELECT tb_e.codigo, tb_e.tituloEvento, tb_p.nombres as participante, tb_e.tipoEvento, tb_e.coordinador, tb_e.costo, tb_e.fecha, tb_e.hora, tb_e.lugar, 
        tb_e.rutaImg, tb_e.pdf, tb_e.estado, tb_e.calificacion, tb_e.observacion, tb_e.fechRegistro as eventoRegistrado, tb_e.usuario, 
        tb_p.institucion, tb_p.distrito, tb_p.region, tb_p.provincia, tb_p.cargo, tb_p.email, tb_p.movil, tb_p.telefono, tb_p.fechRegistro as fechaRegistro
        FROM tb_eventos tb_e, tb_participantes tb_p, tb_gestion tb_g 
        WHERE tb_e.id_evento = tb_g.fk_evento AND tb_p.id_participante = tb_g.fk_participante;`)

        if (consulDetallado.length >= 1){
            return res.status(200).json({ code: 200, status: true, message: 'Consulta exitosa', consulDetallado: consulDetallado });
        }else{
            return res.status(200).json({ code: 204, status: true, message: 'No existen datos' });
        }


    } catch (e) {
        console.log('ingresa al error');
        console.log(e.message);
        return res.status(400).json({ status: 400, message: e.message });
      }
};