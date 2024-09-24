import { Router } from "express";

import areaController from "../controller/area.controller";

class AreaRoutes{
    
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/:id_empresa',areaController.obtenerAreas);
        this.router.get('/verUna/:id_area',areaController.verArea);
        this.router.post('/',areaController.registrarArea);
        this.router.put('/:id_area',areaController.modificarArea);
        this.router.delete('/:id_area',areaController.eliminarArea);
    }
}

const areaRoutes = new AreaRoutes();
export default areaRoutes.router;