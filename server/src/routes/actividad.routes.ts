import { Router } from "express";

import actividadController from "../controller/actividad.controller";

class ActividadRoutes{
    
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/:id_proyecto',actividadController.obtenerActividades);
        this.router.get('/usuario/:id_proyecto/:id_usuario',actividadController.obtenerActividadesEmpleado);
        this.router.get('/ver/:id_actividad',actividadController.verActividad);
        this.router.get('/obtener/:id_actividad',actividadController.obtenerActividad);
        this.router.post('/',actividadController.registrarActividad);
        this.router.put('/:id_actividad',actividadController.modificarActividad);
        this.router.delete('/:id_actividad',actividadController.eliminarActividad);
        this.router.put('/estado/:id_actividad',actividadController.actualizarEstadoActividad);
        this.router.get('/comentario/:id_actividad',actividadController.obtenerComentariosActividad);
        this.router.post('/comentario/',actividadController.registrarComentarioActividad);
        this.router.get('/empl-proy/no_cumplida/:id_proyecto/:id_empleado',actividadController.actividadesNoCumplidasEmplProy);
        this.router.get('/empl-proy/cumplida/:id_proyecto/:id_empleado',actividadController.actividadesCumplidasEmplProy);
        this.router.get('/proyecto/no_cumplida/:id_proyecto',actividadController.actividadesNoCumplidasProyecto);
        this.router.get('/proyecto/cumplida/:id_proyecto',actividadController.actividadesCumplidasProyecto);
        this.router.get('/empleado/cumplida/:id_empleado',actividadController.actividadesCumplidasEmpleado);
        this.router.get('/proyecto/pendiente/:id_proyecto',actividadController.actividadesPendientesProyecto);
        this.router.get('/empleado/pendiente/:id_empleado',actividadController.actividadesPendientesEmpleado);
        this.router.get('/proyecto/retrasada/:id_proyecto',actividadController.actividadesRetrasadasProyecto);
        this.router.get('/empleado/retrasada/:id_empleado',actividadController.actividadesRetrasadasEmpleado);
    }
}

const actividadRoutes = new ActividadRoutes();
export default actividadRoutes.router;