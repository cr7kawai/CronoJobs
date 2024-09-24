import { Router } from "express";

import proyectoController from "../controller/proyecto.controller";

class ProyectoRoutes{
    
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/empresa/:id_empresa',proyectoController.obtenerProyectos);
        this.router.get('/:id_proyecto',proyectoController.verProyecto);
        this.router.get('/obtener/:id_proyecto',proyectoController.obtenerProyecto);
        this.router.get('/area/:id_area',proyectoController.obtenerProyectosArea);
        this.router.post('/',proyectoController.registrarProyecto);
        this.router.put('/:id_proyecto',proyectoController.modificarProyecto);
        this.router.put('/estado/:id_proyecto',proyectoController.terminarProyecto);
        this.router.delete('/:id_proyecto',proyectoController.eliminarProyecto);
    }
}

const proyectoRoutes = new ProyectoRoutes();
export default proyectoRoutes.router;