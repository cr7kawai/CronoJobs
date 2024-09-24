"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nota_controller_1 = __importDefault(require("../controller/nota.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
class NotaRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/:id_proyecto', auth_middleware_1.verifyToken, nota_controller_1.default.obtenerNotas);
        this.router.post('/', auth_middleware_1.verifyToken, nota_controller_1.default.registrarNota);
        this.router.put('/:id_nota', auth_middleware_1.verifyToken, nota_controller_1.default.modificarNota);
        this.router.delete('/:id_nota', auth_middleware_1.verifyToken, nota_controller_1.default.eliminarNota);
    }
}
const notaRoutes = new NotaRoutes();
exports.default = notaRoutes.router;
