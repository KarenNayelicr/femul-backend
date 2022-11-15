const { response } = require("express");
const path = require('path');
const fs = require('fs');
const { query } = require('../../database/conexion');
const PdfPrinter = require("pdfmake");
const fonts = require("./recursos/fonts");
const styles = require("./recursos/styles");

exports.reportePDF = async function (req, res = response) {

    try {

        console.log('ingresa a la funcion pdf: ');
        let tituloEvento = '', codigo = '', tipoEvento = '', coordinador = '', costo = '', fecha = '', hora = '', lugar = '', estado = '', fechRegis = '';
        

        let cargaEventos = await query(`select * from tb_eventos;`);

        if (cargaEventos.length >= 1) {
            
            let i ;            
            for(i=0; i < cargaEventos.length; i++){
                codigo = codigo + cargaEventos[i]['codigo'] + "\n\n";
                tituloEvento = tituloEvento + cargaEventos[i]['tituloEvento'] + "\n\n"; //Se debe concatenar valores
                tipoEvento = tipoEvento + cargaEventos[i]['tipoEvento'] + "\n\n";
                coordinador = coordinador + cargaEventos[i]['coordinador'] + "\n\n";
                costo = costo + cargaEventos[i]['costo'] + "\n\n";
                fecha = fecha + cargaEventos[i]['fecha'] + "\n\n";
                hora = hora + cargaEventos[i]['hora'] + "\n\n";
                lugar = lugar + cargaEventos[i]['lugar'] + "\n\n";
                estado = estado + cargaEventos[i]['estado'] + "\n\n";
                fechRegis = fechRegis + ((cargaEventos[i]['fechRegistro']).toLocaleString()) + "\n\n";
           }

        }
   

        let content = [

            { image: path.join(__dirname, '../../controladores/reportes/image/rc5.png'), width: 40, alignment: 'right', },

            //ENCABEZADO INFO LABORAL
            { text: "INFORMACIÓN DE LOS EVENTOS", alignment: 'center', fontSize: 22, bold: true, color: '#18047F' }, { text: "\n" },


            //DETALLO LA CABECERA DE LOS TRABAJOS
            {
                alignment: 'center',
                color: '#18047F',
                fontSize: 8,
                columns: [
                    { width: 70, text: 'Código', bold: true },
                    { width: 100, text: 'Titulo', bold: true },
                    { width: 80, text: 'Evento', bold: true },
                    { width: 100, text: 'Coordinador', bold: true },
                    { width: 60, text: 'Precio', bold: true },
                    { width: 60, text: 'fecha', bold: true },
                    { width: 70, text: 'hora', bold: true },
                    { width: 70, text: 'lugar', bold: true },
                    { width: 60, text: 'Estado', bold: true },
                    { width: 80, text: 'Fecha de registro', bold: true }
                ]
            },

            { text: "\n" },



            {            
                alignment: 'center',
                fontSize: 8,
                margin: [ 0, 0, 0, 20 ],
                columns: [
                    { width: 70, text: codigo},
                    { width: 100, text: tituloEvento},
                    { width: 80, text: tipoEvento},                    
                    { width: 100, text: coordinador},
                    { width: 60, text: costo},                    
                    { width: 60, text: fecha},
                    { width: 70, text: hora},
                    { width: 70, text: lugar},
                    { width: 60, text: estado},
                    { width: 80, text: fechRegis}
                    
                    
                ]
            },
  
        ]


        let docDefinition = {
            content: content,
            styles: styles,
            pageMargins: [ 5, 10, 20, 10 ],
            pageOrientation: 'landscape', //horizontal
        };

        const printer = new PdfPrinter(fonts);
        var temp123;

        //Aqui genero el pdf
        let pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs.createWriteStream(path.join(__dirname, '../../public/reportes/reporteEventos.pdf')));
        pdfDoc.end();


        function downloadFile(){
            res.download(path.join(__dirname, '../../public/reportes/reporteEventos.pdf'));
        }
        //Con esto envío a descargar al archivo

        setTimeout(() => {
            downloadFile();
            return false;
        }, 3000);


        
        //return res.status(200).json({ code: 200, status: true, message: 'Archivo Pdf Creado' });

        console.log('creado');

    } catch (e) {
        console.log('ingresa al error');
        console.log(e);
        return res.status(400).json({ status: 400, message: e.message });
    }
};


exports.reportePDFAfiliados = async function (req, res = response) {

    try {

        console.log('ingresa a la funcion pdf: ');
        let dni = '', nombres = '', institucion = '', distrito = '', region = '', provincia = '', cargo = '', movil = '', telefono = '';
        

        let cargaParticipantes = await query(`select * from tb_participantes;`);

        if (cargaParticipantes.length >= 1) {
            
            let i ;            
            for(i=0; i < cargaParticipantes.length; i++){
                dni = dni + cargaParticipantes[i]['dni'] + "\n\n";
                nombres = nombres + cargaParticipantes[i]['nombres'] + "\n\n"; //Se debe concatenar valores
                institucion = institucion + cargaParticipantes[i]['institucion'] + "\n\n";
                distrito = distrito + cargaParticipantes[i]['distrito'] + "\n\n";
                region = region + cargaParticipantes[i]['region'] + "\n\n";
                provincia = provincia + cargaParticipantes[i]['provincia'] + "\n\n";
                cargo = cargo + cargaParticipantes[i]['cargo'] + "\n\n";
                movil = movil + cargaParticipantes[i]['movil'] + "\n\n";
                telefono = telefono + cargaParticipantes[i]['telefono'] + "\n\n";
           }

        }
   

        let content = [

            { image: path.join(__dirname, '../../controladores/reportes/image/rc5.png'), width: 40, alignment: 'right', },

            //ENCABEZADO INFO LABORAL
            { text: "INFORMACIÓN DE LOS PARTICIPANTES", alignment: 'center', fontSize: 22, bold: true, color: '#18047F' }, { text: "\n" },


            //DETALLO LA CABECERA DE LOS TRABAJOS
            {
                alignment: 'center',
                color: '#18047F',
                fontSize: 8,
                columns: [
                    { width: 80, text: 'Dni', bold: true },
                    { width: 150, text: 'Nombres', bold: true },
                    { width: 120, text: 'Institución', bold: true },
                    { width: 100, text: 'Distrito', bold: true },
                    { width: 60, text: 'Región', bold: true },
                    { width: 60, text: 'Provincia', bold: true },
                    { width: 70, text: 'Cargo', bold: true },                    
                    { width: 60, text: 'Movil', bold: true },
                    { width: 80, text: 'Teléfono', bold: true }
                ]
            },

            { text: "\n" },



            {            
                alignment: 'center',
                fontSize: 8,
                margin: [ 0, 0, 0, 20 ],
                columns: [
                    { width: 80, text: dni},
                    { width: 150, text: nombres},
                    { width: 120, text: institucion},                    
                    { width: 100, text: distrito},
                    { width: 60, text: region},                    
                    { width: 60, text: provincia},
                    { width: 70, text: cargo},
                    { width: 60, text: movil},
                    { width: 80, text: telefono}
                    
                    
                ]
            },
  
        ]


        let docDefinition = {
            content: content,
            styles: styles,
            pageMargins: [ 5, 10, 20, 10 ],
            pageOrientation: 'landscape', //horizontal
        };

        const printer = new PdfPrinter(fonts);
        var temp123;

        //Aqui genero el pdf
        let pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs.createWriteStream(path.join(__dirname, '../../public/reportes/reporteParticipantes.pdf')));
        pdfDoc.end();


        function downloadFile(){
            res.download(path.join(__dirname, '../../public/reportes/reporteParticipantes.pdf'));
        }
        //Con esto envío a descargar al archivo

        setTimeout(() => {
            downloadFile();
            return false;
        }, 3000);


        
        //return res.status(200).json({ code: 200, status: true, message: 'Archivo Pdf Creado' });

        console.log('creado');

    } catch (e) {
        console.log('ingresa al error');
        console.log(e);
        return res.status(400).json({ status: 400, message: e.message });
    }
};


exports.reporteGeneral = async function (req, res = response) {

    try {

        console.log('ingresa a la funcion pdf General: ');
        let evento = '', participante = '', tipoEvento = '', precio = '', fecha = '', hora = '', lugar = '';
        

        let consulDetallado = await query(`SELECT tb_e.codigo, tb_e.tituloEvento, tb_p.nombres as participante, tb_e.tipoEvento, tb_e.coordinador, tb_e.costo, tb_e.fecha, tb_e.hora, tb_e.lugar, 
        tb_e.rutaImg, tb_e.pdf, tb_e.estado, tb_e.calificacion, tb_e.observacion, tb_e.fechRegistro as eventoRegistrado, tb_e.usuario, 
        tb_p.institucion, tb_p.distrito, tb_p.region, tb_p.provincia, tb_p.cargo, tb_p.email, tb_p.movil, tb_p.telefono, tb_p.fechRegistro as fechaRegistro
        FROM tb_eventos tb_e, tb_participantes tb_p, tb_gestion tb_g 
        WHERE tb_e.id_evento = tb_g.fk_evento AND tb_p.id_participante = tb_g.fk_participante;`)

        if (consulDetallado.length >= 1) {
            
            let i ;            
            for(i=0; i < consulDetallado.length; i++){
                evento = evento + consulDetallado[i]['tituloEvento'] + "\n\n";
                participante = participante + consulDetallado[i]['participante'] + "\n\n"; //Se debe concatenar valores
                tipoEvento = tipoEvento + consulDetallado[i]['tipoEvento'] + "\n\n";
                precio = precio + consulDetallado[i]['costo'] + "\n\n";
                fecha = fecha + consulDetallado[i]['fecha'] + "\n\n";
                hora = hora + consulDetallado[i]['hora'] + "\n\n";
                lugar = lugar + consulDetallado[i]['lugar'] + "\n\n";
           }

        }
   

        let content = [

            { image: path.join(__dirname, '../../controladores/reportes/image/rc5.png'), width: 40, alignment: 'right', },

            //ENCABEZADO INFO LABORAL
            { text: "INFORMACIÓN RESUMIDA", alignment: 'center', fontSize: 22, bold: true, color: '#18047F' }, { text: "\n" },


            //DETALLO LA CABECERA DE LOS TRABAJOS
            {
                alignment: 'center',
                color: '#18047F',
                fontSize: 8,
                columns: [
                    { width: 150, text: 'Evento', bold: true },
                    { width: 150, text: 'Participante', bold: true },
                    { width: 120, text: 'Tipo', bold: true },
                    { width: 100, text: 'Precio', bold: true },
                    { width: 70, text: 'Fecha', bold: true },
                    { width: 70, text: 'Hora', bold: true },
                    { width: 70, text: 'Lugar', bold: true },                    
                ]
            },

            { text: "\n" },



            {            
                alignment: 'center',
                fontSize: 8,
                margin: [ 0, 0, 0, 20 ],
                columns: [
                    { width: 150, text: evento},
                    { width: 150, text: participante},
                    { width: 120, text: tipoEvento},                    
                    { width: 100, text: precio},
                    { width: 70, text: fecha},                    
                    { width: 70, text: hora},
                    { width: 70, text: lugar},
                ]
            },
  
        ]


        let docDefinition = {
            content: content,
            styles: styles,
            pageMargins: [ 5, 10, 20, 10 ],
            pageOrientation: 'landscape', //horizontal
        };

        const printer = new PdfPrinter(fonts);
        var temp123;

        //Aqui genero el pdf
        let pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs.createWriteStream(path.join(__dirname, '../../public/reportes/reporteGeneral.pdf')));
        pdfDoc.end();


        function downloadFile(){
            res.download(path.join(__dirname, '../../public/reportes/reporteGeneral.pdf'));
        }
        //Con esto envío a descargar al archivo

        setTimeout(() => {
            downloadFile();
            return false;
        }, 3000);


        
        //return res.status(200).json({ code: 200, status: true, message: 'Archivo Pdf Creado' });

        console.log('creado');

    } catch (e) {
        console.log('ingresa al error');
        console.log(e);
        return res.status(400).json({ status: 400, message: e.message });
    }
};