import { Router } from "express";

import notaController from "../controller/nota.controller";

class NotaRoutes{
    
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/:id_proyecto',notaController.obtenerNotas);
        this.router.post('/',notaController.registrarNota);
        this.router.put('/:id_nota',notaController.modificarNota);
        this.router.delete('/:id_nota',notaController.eliminarNota);
    }
}

const notaRoutes = new NotaRoutes();
export default notaRoutes.router;