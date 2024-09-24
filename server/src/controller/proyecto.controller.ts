import { Request, Response, text } from 'express';

import pool from '../connection';

class ProyectoController{

    public async obtenerProyectos (req: Request, res: Response){
      const { id_empresa } = req.params;
      const proyectos = await pool.query('SELECT pk_proyecto, p.nombre, descripcion, fecha_inicio, fecha_fin, CASE p.estado WHEN 0 THEN "Pendiente" WHEN 1 THEN "Realizado" END AS estado, fecha_termino, a.nombre as area FROM proyecto as p INNER JOIN area as a on a.pk_area = p.fk_area INNER JOIN empresa as e on e.pk_empresa = a.fk_empresa WHERE e.pk_empresa = ? order by fecha_termino asc',
        [id_empresa]
      );
      res.json(proyectos);
    }

    public async verProyecto (req: Request, res: Response): Promise<any> {
        const { id_proyecto } = req.params;
        const proyecto = await pool.query('Select p.*, u.pk_usuario from proyecto as p INNER JOIN usuario as u ON p.fk_area = u.fk_area WHERE p.pk_proyecto = ? AND u.fk_rol =3', [id_proyecto]);
        if (proyecto.length > 0) {
            return res.json(proyecto[0]);
        }
        res.status(404).json({ text: "El proyecto no existe" });
    }

    public async obtenerProyecto (req: Request, res: Response): Promise<any> {
      const { id_proyecto } = req.params;
      const proyecto = await pool.query('SELECT pk_proyecto, p.nombre, descripcion, fecha_inicio, fecha_fin, CASE estado WHEN 0 THEN "Pendiente" WHEN 1 THEN "Realizado" END AS estado, fecha_termino, a.nombre as area FROM proyecto as p INNER JOIN area as a on pk_area = fk_area WHERE pk_proyecto = ?', [id_proyecto]);
      if (proyecto.length > 0) {
          return res.json(proyecto[0]);
      }
      res.status(404).json({ text: "El proyecto no existe" });
  }

    public async obtenerProyectosArea (req: Request, res: Response): Promise<any>{
        const { id_area } = req.params;
        const proyectos = await pool.query('SELECT pk_proyecto, p.nombre, descripcion, fecha_inicio, fecha_fin, CASE estado WHEN 0 THEN "Pendiente" WHEN 1 THEN "Realizado" END AS estado, fecha_termino, a.nombre as area FROM proyecto as p INNER JOIN area as a on pk_area = fk_area WHERE pk_area = ? order by fecha_termino asc', [id_area]);
        if(proyectos.length > 0){
            return res.json(proyectos)
        }
        res.status(404).json({text: 'No hay proyectos en el área'});
    }

    public async registrarProyecto(req: Request, res: Response): Promise<void> {
        try {
          const result = await pool.query('INSERT INTO proyecto SET ?',[req.body]);
          res.status(201).json({ message: 'Se registró el proyecto correctamente', insertedId: result.insertId });
        } catch (error) {
          console.error('Error al registrar el proyecto:', error);
          res.status(500).json({ message: 'Error al registrar el proyecto' });
        }
    }
      
    public async modificarProyecto(req: Request, res: Response): Promise<void> {
        try {
          const { id_proyecto } = req.params;
          await pool.query('UPDATE proyecto SET ? WHERE pk_proyecto = ?', [req.body, id_proyecto]);
          res.json({ message: 'El proyecto ha sido actualizado' });
        } catch (error) {
          console.error('Error al modificar el proyecto:', error);
          res.status(500).json({ message: 'Error al modificar el proyecto' });
        }
    }

    public async terminarProyecto(req: Request, res: Response): Promise<void> {
      try {
        const { id_proyecto } = req.params;
        await pool.query('UPDATE proyecto SET estado = 1, fecha_termino = NOW() WHERE pk_proyecto = ?', [id_proyecto]);
        res.json({ message: 'El proyecto ha sido completado' });
      } catch (error) {
        console.error('Error al completar el proyecto:', error);
        res.status(500).json({ message: 'Error al completar el proyecto' });
      }
    }
      
    public async eliminarProyecto(req: Request, res: Response): Promise<void> {
        try {
          const { id_proyecto } = req.params;
          await pool.query('DELETE FROM nota WHERE fk_proyecto = ?', [id_proyecto]);
          await pool.query('DELETE c FROM comentario AS c WHERE c.fk_actividad IN (SELECT a.pk_actividad FROM actividad AS a WHERE a.fk_proyecto = ?)',[id_proyecto]);
          await pool.query('DELETE FROM actividad WHERE fk_proyecto = ?',[id_proyecto]);
          await pool.query('DELETE FROM proyecto WHERE pk_proyecto = ?', [id_proyecto]);
          res.json({ message: 'El proyecto ha sido eliminado' });
        } catch (error) {
          console.error('Error al eliminar el proyecto:', error);
          res.status(500).json({ message: 'Error al eliminar el proyecto' });
        }
    }
}

export const proyectoController = new ProyectoController();
export default proyectoController;