import { Request, Response, text } from 'express';

import pool from '../connection';

class AreaController{

    public async obtenerAreas (req: Request, res: Response){
        const { id_empresa } = req.params
        const areas = await pool.query('SELECT * FROM area WHERE fk_empresa = ?',[id_empresa]);
        res.json(areas);
    }

    public async verArea (req: Request, res: Response){
      const { id_area } = req.params;
      const area = await pool.query('SELECT * FROM area WHERE pk_area = ?',[id_area]);
      if (area.length > 0) {
          return res.json(area[0]);
        }
        res.status(404).json({ text: "El equipo/área no existe" });
    }

    public async registrarArea(req: Request, res: Response): Promise<void> {
        try {
          const result = await pool.query('INSERT INTO area SET ?',[req.body]);
          res.status(201).json({ message: 'Se registró el área/equipo correctamente', insertedId: result.insertId });
        } catch (error) {
          console.error('Error al registrar el área/equipo:', error);
          res.status(500).json({ message: 'Error al registrar el área/equipo' });
        }
    }
      
    public async modificarArea(req: Request, res: Response): Promise<void> {
        try {
          const { id_area } = req.params;
          await pool.query('UPDATE area SET ? WHERE pk_area = ?', [req.body, id_area]);
          res.json({ message: 'El área/equipo ha sido actualizado' });
        } catch (error) {
          console.error('Error al modificar el área/equipo:', error);
          res.status(500).json({ message: 'Error al modificar el área/equipo' });
        }
    }
      
    public async eliminarArea(req: Request, res: Response): Promise<void> {
        try {
          const { id_area } = req.params;
          await pool.query('DELETE FROM area WHERE pk_area = ?', [id_area]);
          res.json({ message: 'El área/equipo ha sido eliminada' });
        } catch (error) {
          console.error('Error al eliminar el área/equipo:', error);
          res.status(500).json({ message: 'Error al eliminar el área/equipo' });
        }
    }
}

export const areaController = new AreaController();
export default areaController;