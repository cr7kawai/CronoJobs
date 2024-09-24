import { Router } from "express";

import proyectoController from "../controller/proyecto.controller";
import { verifyToken } from "../middlewares/auth.middleware";

class ProyectoRoutes{
    
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/empresa/:id_empresa',verifyToken, proyectoController.obtenerProyectos);
        this.router.get('/:id_proyecto',verifyToken, proyectoController.verProyecto);
        this.router.get('/obtener/:id_proyecto',verifyToken, proyectoController.obtenerProyecto);
        this.router.get('/area/:id_area',verifyToken, proyectoController.obtenerProyectosArea);
        this.router.post('/',verifyToken, proyectoController.registrarProyecto);
        this.router.put('/:id_proyecto',verifyToken, proyectoController.modificarProyecto);
        this.router.put('/estado/:id_proyecto',verifyToken, proyectoController.terminarProyecto);
        this.router.delete('/:id_proyecto',verifyToken, proyectoController.eliminarProyecto);
    }
}

const proyectoRoutes = new ProyectoRoutes();
export default proyectoRoutes.router;