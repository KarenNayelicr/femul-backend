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

        //Aqui genero el pdf
        let pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs.createWriteStream(path.join(__dirname, '../../public/reportes/reporteEventos.pdf')));
        pdfDoc.end();


        function downloadFile() {
            res.download(pdfDoc);
        }

        //Con esto envío a descargar al archivo
        //downloadFile();
        //return false;
        return res.status(200).json({ code: 200, status: true, message: 'Archivo Pdf Creado' });

        console.log('creado');

    } catch (e) {
        console.log('ingresa al error');
        console.log(e);
        return res.status(400).json({ status: 400, message: e.message });
    }
};