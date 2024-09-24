"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const actividad_controller_1 = __importDefault(require("../controller/actividad.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
class ActividadRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/:id_proyecto', auth_middleware_1.verifyToken, actividad_controller_1.default.obtenerActividades);
        this.router.get('/usuario/:id_proyecto/:id_usuario', auth_middleware_1.verifyToken, actividad_controller_1.default.obtenerActividadesEmpleado);
        this.router.get('/ver/:id_actividad', auth_middleware_1.verifyToken, actividad_controller_1.default.verActividad);
        this.router.get('/obtener/:id_actividad', auth_middleware_1.verifyToken, actividad_controller_1.default.obtenerActividad);
        this.router.post('/', auth_middleware_1.verifyToken, actividad_controller_1.default.registrarActividad);
        this.router.put('/:id_actividad', auth_middleware_1.verifyToken, actividad_controller_1.default.modificarActividad);
        this.router.delete('/:id_actividad', auth_middleware_1.verifyToken, actividad_controller_1.default.eliminarActividad);
        this.router.put('/estado/:id_actividad', auth_middleware_1.verifyToken, actividad_controller_1.default.actualizarEstadoActividad);
        this.router.get('/comentario/:id_actividad', auth_middleware_1.verifyToken, actividad_controller_1.default.obtenerComentariosActividad);
        this.router.post('/comentario/', auth_middleware_1.verifyToken, actividad_controller_1.default.registrarComentarioActividad);
        this.router.get('/empl-proy/no_cumplida/:id_proyecto/:id_empleado', auth_middleware_1.verifyToken, actividad_controller_1.default.actividadesNoCumplidasEmplProy);
        this.router.get('/empl-proy/cumplida/:id_proyecto/:id_empleado', auth_middleware_1.verifyToken, actividad_controller_1.default.actividadesCumplidasEmplProy);
        this.router.get('/proyecto/no_cumplida/:id_proyecto', auth_middleware_1.verifyToken, actividad_controller_1.default.actividadesNoCumplidasProyecto);
        this.router.get('/proyecto/cumplida/:id_proyecto', auth_middleware_1.verifyToken, actividad_controller_1.default.actividadesCumplidasProyecto);
        this.router.get('/empleado/cumplida/:id_empleado', auth_middleware_1.verifyToken, actividad_controller_1.default.actividadesCumplidasEmpleado);
        this.router.get('/proyecto/pendiente/:id_proyecto', auth_middleware_1.verifyToken, actividad_controller_1.default.actividadesPendientesProyecto);
        this.router.get('/empleado/pendiente/:id_empleado', auth_middleware_1.verifyToken, actividad_controller_1.default.actividadesPendientesEmpleado);
        this.router.get('/proyecto/retrasada/:id_proyecto', auth_middleware_1.verifyToken, actividad_controller_1.default.actividadesRetrasadasProyecto);
        this.router.get('/empleado/retrasada/:id_empleado', auth_middleware_1.verifyToken, actividad_controller_1.default.actividadesRetrasadasEmpleado);
    }
}
const actividadRoutes = new ActividadRoutes();
exports.default = actividadRoutes.router;
