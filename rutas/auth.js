const { Router } = require("express");
const AuthRoutes = Router();
const { consultasABC, consultas123 } = require("../controladores/consultas");
const { loginIngreso, sesionActiva } = require("../controladores/user/login");
const { guardaEvento, cargaPhotoEvento, cargaEventos, cargaEventosRegistro, editarEvento } = require("../controladores/evento/eventos");



/* Login de ingreso */
AuthRoutes.post("/loginIngreso", loginIngreso)
AuthRoutes.post("/sesionActiva", sesionActiva);

/* Guarda Eventos */
AuthRoutes.post("/guardaEvento", guardaEvento);
AuthRoutes.post("/editarEvento", editarEvento);
AuthRoutes.get("/cargaPhotoEvento/:id", cargaPhotoEvento);
AuthRoutes.get("/cargaEventos", cargaEventos);
AuthRoutes.get("/cargaEventosRegistro/:id", cargaEventosRegistro);



/* Rutas de Ejemplo*/
AuthRoutes.get("/consultas", consultasABC);
AuthRoutes.get("/consultas/:id", consultas123);



module.exports = AuthRoutes;