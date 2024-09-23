"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recurso_controller_1 = __importDefault(require("../controller/recurso.controller"));
class RecursoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/:id_proyecto', recurso_controller_1.default.obtenerSolicitudRecursos);
        this.router.post('/', recurso_controller_1.default.recgistrarSolicitudRecursos);
        this.router.get('/obtener/:id_solicitud', recurso_controller_1.default.obtenerSolicitud);
        this.router.put('/:id_solicitud', recurso_controller_1.default.modificarSolicitud);
        this.router.delete('/:id_solicitud', recurso_controller_1.default.eliminarSolicitud);
    }
}
const recursoRoutes = new RecursoRoutes();
exports.default = recursoRoutes.router;
