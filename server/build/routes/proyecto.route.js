"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const proyecto_controller_1 = __importDefault(require("../controller/proyecto.controller"));
class UserRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', proyecto_controller_1.default.obtenerProyectos);
        this.router.get('/:id', proyecto_controller_1.default.verProyecto);
        this.router.get('/area/:area', proyecto_controller_1.default.obtenerProyectosArea);
        this.router.post('/', proyecto_controller_1.default.registrarProyecto);
        this.router.put('/:id', proyecto_controller_1.default.modificarProyecto);
        this.router.delete('/:id', proyecto_controller_1.default.eliminarProyecto);
        this.router.post('/notificacion/', proyecto_controller_1.default.enviarNotificacion);
        this.router.get('/notificacion/:user', proyecto_controller_1.default.obtenerNotificaciones);
    }
}
const userRoutes = new UserRoutes();
exports.default = userRoutes.router;
