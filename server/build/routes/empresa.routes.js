"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const empresa_controller_1 = __importDefault(require("../controller/empresa.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
class NotaRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', auth_middleware_1.verifyToken, empresa_controller_1.default.obtenerEmpresas);
        this.router.get('/:id_empresa', auth_middleware_1.verifyToken, empresa_controller_1.default.filtrarEmpresa);
        this.router.post('/', empresa_controller_1.default.registrarEmpresa);
        this.router.put('/:id_empresa', auth_middleware_1.verifyToken, empresa_controller_1.default.modificarEmpresa);
        this.router.delete('/:id_empresa', auth_middleware_1.verifyToken, empresa_controller_1.default.eliminarEmpresa);
    }
}
const notaRoutes = new NotaRoutes();
exports.default = notaRoutes.router;
