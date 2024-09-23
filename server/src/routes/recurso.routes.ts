import { Router } from "express";

import recursoController from "../controller/recurso.controller";

class RecursoRoutes{
    
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/:id_proyecto',recursoController.obtenerSolicitudRecursos);
        this.router.post('/',recursoController.recgistrarSolicitudRecursos);
        this.router.get('/obtener/:id_solicitud',recursoController.obtenerSolicitud);
        this.router.put('/:id_solicitud',recursoController.modificarSolicitud)
        this.router.delete('/:id_solicitud',recursoController.eliminarSolicitud);
    }
}

const recursoRoutes = new RecursoRoutes();
export default recursoRoutes.router;