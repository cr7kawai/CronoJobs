import { Request, Response, text } from 'express';

import pool from '../connection';

class EmpresaController{

    public async obtenerEmpresas (req: Request, res: Response){
        const empresas = await pool.query('SELECT * FROM empresa');
        res.json(empresas);
    }

    public async filtrarEmpresa (req: Request, res: Response){
        const { id_empresa } = req.params
        const empresa = await pool.query('SELECT * FROM empresa WHERE pk_empresa = ?',[id_empresa]);
        res.json(empresa);
    }

    public async registrarEmpresa(req: Request, res: Response): Promise<void> {
        try {
          const result = await pool.query('INSERT INTO empresa SET ?',[req.body]);
          res.status(200).json({ message: 'Se registró la empresa correctamente', insertedId: result.insertId });
        } catch (error) {
          console.error('Error al registrar la empresa:', error);
          res.status(500).json({ message: 'Error al registrar la empresa' });
        }
    }
      
    public async modificarEmpresa(req: Request, res: Response): Promise<void> {
        try {
          const { id_empresa } = req.params;
          await pool.query('UPDATE empresa SET ? WHERE pk_empresa = ?', [req.body, id_empresa]);
          res.json({ message: 'La empresa ha sido actualizado' });
        } catch (error) {
          console.error('Error al modificar la empresa:', error);
          res.status(500).json({ message: 'Error al modificar la empresa' });
        }
    }
      
    public async eliminarEmpresa(req: Request, res: Response): Promise<void> {
        try {
          const { id_empresa } = req.params;
          await pool.query('DELETE FROM empresa WHERE pk_empresa = ?', [id_empresa]);
          res.json({ message: 'La empresa ha sido eliminada' });
        } catch (error) {
          console.error('Error al eliminar la empresa:', error);
          res.status(500).json({ message: 'Error al eliminar la empresa' });
        }
    }
}

export const empresaController = new EmpresaController();
export default empresaController;