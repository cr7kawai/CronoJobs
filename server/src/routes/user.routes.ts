import { Router } from "express";

import userController from "../controller/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";

class UserRoutes{
    
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/empresa/:id_empresa',verifyToken, userController.obtenerUsuarios);
        this.router.get('/rol/',verifyToken, userController.obtenerRoles);
        this.router.get('/area/',verifyToken, userController.obtenerAreas);
        this.router.get('/:id_user',verifyToken, userController.verUsuario);
        this.router.get('/obtener/:id_user',verifyToken, userController.obtenerUsuario);
        this.router.get('/credenciales/:id_user',verifyToken, userController.obtenerCredenciales);
        this.router.get('/area/:id_area/:id_empresa',verifyToken, userController.obtenerUsuariosArea);
        this.router.post('/',userController.registrarUsuario);
        this.router.put('/:id_user',verifyToken, userController.modificarUsuario);
        this.router.delete('/:id_user',verifyToken, userController.eliminarUsuario);
        this.router.get('/password/:email',userController.enviarEmailConfirmacion);
        this.router.get('/obtener/email/:email',userController.obtenerUsuarioEmail);
        this.router.put('/password/:id_user/:email',userController.cambiarContrasena);
        
        this.router.post('/notificacion/',verifyToken, userController.enviarNotificacion);
        this.router.get('/notificacion/:id_user',verifyToken, userController.obtenerNotificaciones);
        this.router.post('/validarEmailTel/',userController.validarTelefonoEmail);

        // Con token v1 pa registro y cambio de suscripción
        this.router.post('/inicio_sesion',userController.inicio_sesion);

        // Con tokeken v2 pa login normal
        this.router.post('/login',userController.login);
        this.router.post("/verify-otp", userController.verifyOtp);
    }
}

const userRoutes = new UserRoutes();
export default userRoutes.router;