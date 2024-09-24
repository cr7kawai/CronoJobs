import { Router } from "express";

import actividadController from "../controller/actividad.controller";
import { verifyToken } from '../middlewares/auth.middleware';


class ActividadRoutes{
    
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/:id_proyecto',verifyToken, actividadController.obtenerActividades);
        this.router.get('/usuario/:id_proyecto/:id_usuario',verifyToken, actividadController.obtenerActividadesEmpleado);
        this.router.get('/ver/:id_actividad',verifyToken, actividadController.verActividad);
        this.router.get('/obtener/:id_actividad',verifyToken, actividadController.obtenerActividad);
        this.router.post('/',verifyToken, actividadController.registrarActividad);
        this.router.put('/:id_actividad',verifyToken, actividadController.modificarActividad);
        this.router.delete('/:id_actividad',verifyToken, actividadController.eliminarActividad);
        this.router.put('/estado/:id_actividad',verifyToken, actividadController.actualizarEstadoActividad);
        this.router.get('/comentario/:id_actividad',verifyToken, actividadController.obtenerComentariosActividad);
        this.router.post('/comentario/',verifyToken, actividadController.registrarComentarioActividad);
        this.router.get('/empl-proy/no_cumplida/:id_proyecto/:id_empleado',verifyToken, actividadController.actividadesNoCumplidasEmplProy);
        this.router.get('/empl-proy/cumplida/:id_proyecto/:id_empleado',verifyToken, actividadController.actividadesCumplidasEmplProy);
        this.router.get('/proyecto/no_cumplida/:id_proyecto',verifyToken, actividadController.actividadesNoCumplidasProyecto);
        this.router.get('/proyecto/cumplida/:id_proyecto',verifyToken, actividadController.actividadesCumplidasProyecto);
        this.router.get('/empleado/cumplida/:id_empleado',verifyToken, actividadController.actividadesCumplidasEmpleado);
        this.router.get('/proyecto/pendiente/:id_proyecto',verifyToken, actividadController.actividadesPendientesProyecto);
        this.router.get('/empleado/pendiente/:id_empleado',verifyToken, actividadController.actividadesPendientesEmpleado);
        this.router.get('/proyecto/retrasada/:id_proyecto',verifyToken, actividadController.actividadesRetrasadasProyecto);
        this.router.get('/empleado/retrasada/:id_empleado',verifyToken, actividadController.actividadesRetrasadasEmpleado);
    }
}

const actividadRoutes = new ActividadRoutes();
export default actividadRoutes.router;