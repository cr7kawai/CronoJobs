"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controller/user.controller"));
class UserRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', user_controller_1.default.obtenerUsuarios);
        this.router.get('/rol/', user_controller_1.default.obtenerRoles);
        this.router.get('/area/', user_controller_1.default.obtenerAreas);
        this.router.get('/:id_user', user_controller_1.default.verUsuario);
        this.router.get('/obtener/:id_user', user_controller_1.default.obtenerUsuario);
        this.router.get('/area/:id_area', user_controller_1.default.obtenerUsuariosArea);
        this.router.post('/', user_controller_1.default.registrarUsuario);
        this.router.put('/:id_user', user_controller_1.default.modificarUsuario);
        this.router.delete('/:id_user', user_controller_1.default.eliminarUsuario);
        this.router.put('/password/:id_user/:email', user_controller_1.default.cambiarContrasena);
        this.router.post('/login', user_controller_1.default.login);
        this.router.post('/notificacion/', user_controller_1.default.enviarNotificacion);
        this.router.get('/notificacion/:id_user', user_controller_1.default.obtenerNotificaciones);
    }
}
const userRoutes = new UserRoutes();
exports.default = userRoutes.router;
