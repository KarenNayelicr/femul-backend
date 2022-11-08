const { Router } = require("express");
const AuthRoutes = Router();
const { consultasABC, consultas123 } = require("../controladores/consultas");
const { loginIngreso, sesionActiva } = require("../controladores/user/login");
const { consultarParticipantes, agregarParticipantes } = require("../controladores/participantes/participantes")
const { guardaEvento, cargaPhotoEvento, cargaEventos, cargaEventosRegistro, editarEvento, cuentaEventos } = require("../controladores/evento/eventos");
const { reporteExcel, reporteExcelEventos, reporteDetallado, reporteExcelGeneral, reporteExcelParticipantes } = require("../controladores/reportes/excel");
const { reportePDF } = require("../controladores/reportes/pdf");


/* Login de ingreso */
AuthRoutes.post("/loginIngreso", loginIngreso)
AuthRoutes.post("/sesionActiva", sesionActiva);

/* Guarda Eventos */
AuthRoutes.post("/guardaEvento", guardaEvento);
AuthRoutes.post("/editarEvento", editarEvento);
AuthRoutes.get("/cargaPhotoEvento/:id", cargaPhotoEvento);
AuthRoutes.get("/cargaEventos", cargaEventos);
AuthRoutes.get("/cargaEventosRegistro/:id", cargaEventosRegistro);
AuthRoutes.get("/cuentaEventos", cuentaEventos);

/* Participantes */
AuthRoutes.get("/consultarParticipantes/:dni", consultarParticipantes); //agregarParticipantes
AuthRoutes.post("/agregarParticipantes", agregarParticipantes);

/* Reporte Excel */
AuthRoutes.get("/reporteExcel", reporteExcel);
AuthRoutes.get("/reporteExcelEventos", reporteExcelEventos);
AuthRoutes.get("/reporteExcelGeneral", reporteExcelGeneral);
AuthRoutes.get("/reporteDetallado", reporteDetallado);
AuthRoutes.get("/reporteExcelParticipantes", reporteExcelParticipantes);

/* Reporte Pdf */
AuthRoutes.get("/reportePDF", reportePDF);




/* Rutas de Ejemplo*/
AuthRoutes.get("/consultas", consultasABC);
AuthRoutes.get("/consultas/:id", consultas123);



module.exports = AuthRoutes;