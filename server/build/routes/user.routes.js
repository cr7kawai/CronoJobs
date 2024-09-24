"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
class UserRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/empresa/:id_empresa', auth_middleware_1.verifyToken, user_controller_1.default.obtenerUsuarios);
        this.router.get('/rol/', auth_middleware_1.verifyToken, user_controller_1.default.obtenerRoles);
        this.router.get('/area/', auth_middleware_1.verifyToken, user_controller_1.default.obtenerAreas);
        this.router.get('/:id_user', auth_middleware_1.verifyToken, user_controller_1.default.verUsuario);
        this.router.get('/obtener/:id_user', auth_middleware_1.verifyToken, user_controller_1.default.obtenerUsuario);
        this.router.get('/credenciales/:id_user', auth_middleware_1.verifyToken, user_controller_1.default.obtenerCredenciales);
        this.router.get('/area/:id_area/:id_empresa', auth_middleware_1.verifyToken, user_controller_1.default.obtenerUsuariosArea);
        this.router.post('/', user_controller_1.default.registrarUsuario);
        this.router.put('/:id_user', auth_middleware_1.verifyToken, user_controller_1.default.modificarUsuario);
        this.router.delete('/:id_user', auth_middleware_1.verifyToken, user_controller_1.default.eliminarUsuario);
        this.router.get('/password/:email', user_controller_1.default.enviarEmailConfirmacion);
        this.router.get('/obtener/email/:email', user_controller_1.default.obtenerUsuarioEmail);
        this.router.put('/password/:id_user/:email', user_controller_1.default.cambiarContrasena);
        this.router.post('/notificacion/', auth_middleware_1.verifyToken, user_controller_1.default.enviarNotificacion);
        this.router.get('/notificacion/:id_user', auth_middleware_1.verifyToken, user_controller_1.default.obtenerNotificaciones);
        this.router.post('/validarEmailTel/', user_controller_1.default.validarTelefonoEmail);
        // Con token v1
        this.router.post('/inicio_sesion', user_controller_1.default.inicio_sesion);
        // Con token v2
        this.router.post('/login', user_controller_1.default.login);
        this.router.post("/verify-otp", user_controller_1.default.verifyOtp);
    }
}
const userRoutes = new UserRoutes();
exports.default = userRoutes.router;
