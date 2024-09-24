import { Router } from "express";
import empresaController from "../controller/empresa.controller";


class NotaRoutes{
    
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/',empresaController.obtenerEmpresas);
        this.router.get('/:id_empresa',empresaController.filtrarEmpresa)
        this.router.post('/',empresaController.registrarEmpresa);
        this.router.put('/:id_empresa',empresaController.modificarEmpresa);
        this.router.delete('/:id_empresa',empresaController.eliminarEmpresa);
    }
}

const notaRoutes = new NotaRoutes();
export default notaRoutes.router;