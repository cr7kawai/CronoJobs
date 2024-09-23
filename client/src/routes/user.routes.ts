import { Router } from "express";

import userController from "../controller/user.controller";

class UserRoutes{
    
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/',userController.obtenerUsuarios);
        this.router.get('/rol/',userController.obtenerRoles);
        this.router.get('/area/',userController.obtenerAreas);
        this.router.get('/:id_user',userController.verUsuario);
        this.router.get('/obtener/:id_user',userController.obtenerUsuario);
        this.router.get('/area/:id_area',userController.obtenerUsuariosArea);
        this.router.post('/',userController.registrarUsuario);
        this.router.put('/:id_user',userController.modificarUsuario);
        this.router.delete('/:id_user',userController.eliminarUsuario);
        this.router.put('/password/:id_user/:email',userController.cambiarContrasena);
        this.router.post('/login',userController.login);
        this.router.post('/notificacion/',userController.enviarNotificacion);
        this.router.get('/notificacion/:id_user',userController.obtenerNotificaciones);
    }
}

const userRoutes = new UserRoutes();
export default userRoutes.router;