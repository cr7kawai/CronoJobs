import { Request, Response, text } from 'express';

import pool from '../connection';

class RecursoContoller{

    public async obtenerSolicitudRecursos (req: Request, res: Response){
        const { id_proyecto } = req.params
        const notas = await pool.query('SELECT pk_solicitud, titulo, descripcion, fecha_solicitud, CASE estado WHEN 0 THEN "Pendiente" WHEN 1 THEN "Aceptado" WHEN 2 THEN "Rechazado" END AS estado, fecha_aprobacion, fk_proyecto FROM solicitud_recursos WHERE fk_proyecto = ? order by estado asc',[id_proyecto]);
        res.json(notas);
    }

    public async recgistrarSolicitudRecursos(req: Request, res: Response): Promise<void> {
        try {
          const result = await pool.query('INSERT INTO solicitud_recursos SET ?',[req.body]);
          res.status(201).json({ message: 'Se registró la solicitud correctamente', insertedId: result.insertId });
        } catch (error) {
          console.error('Error al registrar la solicitud:', error);
          res.status(500).json({ message: 'Error al registrar la solicitud' });
        }
    }
      
    public async obtenerSolicitud (req: Request, res: Response){
      const { id_solicitud } = req.params
      const solicitud = await pool.query('SELECT pk_solicitud, titulo, descripcion, fecha_solicitud, CASE estado WHEN 0 THEN "Pendiente" WHEN 1 THEN "Aceptado" WHEN 2 THEN "Rechazado" END AS estado, fecha_aprobacion, comentario, fk_proyecto FROM solicitud_recursos WHERE pk_solicitud = ?',[id_solicitud]);
      res.json(solicitud);
  }

  public async modificarSolicitud(req: Request, res: Response): Promise<void> {
    try {
      const { id_solicitud } = req.params;
      await pool.query('UPDATE solicitud_recursos SET ? WHERE pk_solicitud = ?', [req.body, id_solicitud]);
      res.json({ message: 'La solicitud ha sido actualizado' });
    } catch (error) {
      console.error('Error al modificar la solicitud:', error);
      res.status(500).json({ message: 'Error al modificar la solicitud' });
    }
}

      
    public async eliminarSolicitud(req: Request, res: Response): Promise<void> {
        try {
          const { id_solicitud } = req.params;
          await pool.query('DELETE FROM solicitud_recursos WHERE pk_solicitud = ?', [id_solicitud]);
          res.json({ message: 'La solicitud ha sido eliminada' });
        } catch (error) {
          console.error('Error al eliminar la solicitud:', error);
          res.status(500).json({ message: 'Error al eliminar la solicitud' });
        }
    }
}

export const recursoController = new RecursoContoller();
export default recursoController;