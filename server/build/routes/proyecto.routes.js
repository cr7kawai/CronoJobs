"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const proyecto_controller_1 = __importDefault(require("../controller/proyecto.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
class ProyectoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/empresa/:id_empresa', auth_middleware_1.verifyToken, proyecto_controller_1.default.obtenerProyectos);
        this.router.get('/:id_proyecto', auth_middleware_1.verifyToken, proyecto_controller_1.default.verProyecto);
        this.router.get('/obtener/:id_proyecto', auth_middleware_1.verifyToken, proyecto_controller_1.default.obtenerProyecto);
        this.router.get('/area/:id_area', auth_middleware_1.verifyToken, proyecto_controller_1.default.obtenerProyectosArea);
        this.router.post('/', auth_middleware_1.verifyToken, proyecto_controller_1.default.registrarProyecto);
        this.router.put('/:id_proyecto', auth_middleware_1.verifyToken, proyecto_controller_1.default.modificarProyecto);
        this.router.put('/estado/:id_proyecto', auth_middleware_1.verifyToken, proyecto_controller_1.default.terminarProyecto);
        this.router.delete('/:id_proyecto', auth_middleware_1.verifyToken, proyecto_controller_1.default.eliminarProyecto);
    }
}
const proyectoRoutes = new ProyectoRoutes();
exports.default = proyectoRoutes.router;
