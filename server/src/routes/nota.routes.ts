import { Router } from "express";

import notaController from "../controller/nota.controller";
import { verifyToken } from "../middlewares/auth.middleware";

class NotaRoutes{
    
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/:id_proyecto',verifyToken, notaController.obtenerNotas);
        this.router.post('/',verifyToken, notaController.registrarNota);
        this.router.put('/:id_nota',verifyToken, notaController.modificarNota);
        this.router.delete('/:id_nota',verifyToken, notaController.eliminarNota);
    }
}

const notaRoutes = new NotaRoutes();
export default notaRoutes.router;