import { Router } from "express";
import empresaController from "../controller/empresa.controller";
import { verifyToken } from "../middlewares/auth.middleware";


class NotaRoutes{
    
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/',verifyToken, empresaController.obtenerEmpresas);
        this.router.get('/:id_empresa',verifyToken, empresaController.filtrarEmpresa)
        this.router.post('/',empresaController.registrarEmpresa);
        this.router.put('/:id_empresa',verifyToken, empresaController.modificarEmpresa);
        this.router.delete('/:id_empresa',verifyToken, empresaController.eliminarEmpresa);
    }
}

const notaRoutes = new NotaRoutes();
export default notaRoutes.router;