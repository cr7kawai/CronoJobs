import { Router } from "express";

import areaController from "../controller/area.controller";
import { verifyToken } from "../middlewares/auth.middleware";

class AreaRoutes{
    
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/:id_empresa',verifyToken, areaController.obtenerAreas);
        this.router.get('/verUna/:id_area',verifyToken, areaController.verArea);
        this.router.post('/',verifyToken, areaController.registrarArea);
        this.router.put('/:id_area',verifyToken, areaController.modificarArea);
        this.router.delete('/:id_area',verifyToken, areaController.eliminarArea);
    }
}

const areaRoutes = new AreaRoutes();
export default areaRoutes.router;