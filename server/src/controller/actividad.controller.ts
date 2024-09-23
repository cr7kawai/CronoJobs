import { Request, Response, text } from 'express';

import pool from '../connection';

class NotaController{

    public async obtenerActividades (req: Request, res: Response){
        const { id_proyecto } = req.params
        const actividades = await pool.query('SELECT pk_actividad, nombre, descripcion, fecha_inicio, fecha_fin, fecha_termino, CASE estado WHEN 0 THEN "Pendiente" WHEN 1 THEN "Realizado" END AS estado, fk_proyecto FROM actividad WHERE fk_proyecto = ? order by fecha_termino desc',[id_proyecto]);
        res.json(actividades);
    }

    public async obtenerActividadesEmpleado (req: Request, res: Response){
        const { id_proyecto } = req.params;
        const { id_usuario } = req.params;
        const actividades = await pool.query('SELECT pk_actividad, nombre, descripcion, fecha_inicio, fecha_fin, fecha_termino, CASE estado WHEN 0 THEN "Pendiente" WHEN 1 THEN "Realizado" END AS estado, fk_proyecto FROM actividad WHERE fk_proyecto = ? and fk_usuario = ? order by fecha_termino desc',[id_proyecto, id_usuario]);
        res.json(actividades);
    }

    public async verActividad (req: Request, res: Response){
        const { id_actividad } = req.params;
        const actividad = await pool.query('SELECT a.pk_actividad, a.nombre as actividad, a.descripcion, a.fecha_inicio, a.fecha_fin, a.fecha_termino, CASE a.estado WHEN 0 THEN "Pendiente" WHEN 1 THEN "Realizado" END AS estado, u.nombre, u.ape_paterno, u.ape_materno, p.nombre as proyecto FROM actividad as a INNER JOIN usuario as u ON u.pk_usuario = a.fk_usuario INNER JOIN proyecto as p ON p.pk_proyecto = a.fk_proyecto WHERE pk_actividad = ?',[id_actividad]);
        if (actividad.length > 0) {
            return res.json(actividad[0]);
          }
          res.status(404).json({ text: "La actividad no existe" });
    }

    public async obtenerActividad (req: Request, res: Response){
        const { id_actividad } = req.params;
        const actividad = await pool.query('SELECT * FROM actividad WHERE pk_actividad = ?',[id_actividad]);
        if (actividad.length > 0) {
            return res.json(actividad[0]);
          }
          res.status(404).json({ text: "La actividad no existe" });
    }

    public async actividadesNoCumplidasProyecto (req: Request, res: Response){
        const { id_proyecto } = req.params
        const actividades = await pool.query('SELECT * FROM actividad WHERE fk_proyecto = ? AND estado = 0 order by fecha_fin asc',[id_proyecto]);
        res.json(actividades);
    }

    public async registrarActividad(req: Request, res: Response): Promise<void> {
        try {
          const result = await pool.query('INSERT INTO actividad SET ?',[req.body]);
          res.status(201).json({ message: 'Se registró la actividad correctamente', insertedId: result.insertId });
        } catch (error) {
          console.error('Error al registrar la actividad:', error);
          res.status(500).json({ message: 'Error al registrar la actividad' });
        }
    }
      
    public async modificarActividad(req: Request, res: Response): Promise<void> {
        try {
          const { id_actividad } = req.params;
          await pool.query('UPDATE actividad SET ? WHERE pk_actividad = ?', [req.body, id_actividad]);
          res.json({ message: 'La actividad ha sido actualizado' });
        } catch (error) {
          console.error('Error al modificar la actividad:', error);
          res.status(500).json({ message: 'Error al modificar la actividad' });
        }
    }
      
    public async eliminarActividad(req: Request, res: Response): Promise<void> {
        try {
          const { id_actividad } = req.params;
          await pool.query('DELETE FROM comentario WHERE fk_actividad = ?',[id_actividad]);
          await pool.query('DELETE FROM actividad WHERE pk_actividad = ?', [id_actividad]);
          res.json({ message: 'La actividad ha sido eliminada' });
        } catch (error) {
          console.error('Error al eliminar la actividad:', error);
          res.status(500).json({ message: 'Error al eliminar la actividad' });
        }
    }

    public async actividadesCumplidasEmplProy (req: Request, res: Response){
        const { id_proyecto, id_empleado } = req.params
        const actividades = await pool.query('SELECT * FROM actividad WHERE fk_proyecto = ? and fk_usuario = ? and estado = 1 order by fecha_termino desc',[id_proyecto, id_empleado]);
        res.json(actividades);
    }
    public async actividadesNoCumplidasEmplProy (req: Request, res: Response){
        const { id_proyecto, id_empleado } = req.params
        const actividades = await pool.query('SELECT * FROM actividad WHERE fk_proyecto = ? and fk_usuario = ? and estado = 0 order by fecha_fin asc',[id_proyecto, id_empleado]);
        res.json(actividades);
    }

    public async actualizarEstadoActividad (req: Request, res: Response){
        try {
            const { id_actividad } = req.params;
            await pool.query('UPDATE actividad SET estado = 1, fecha_termino = NOW() WHERE pk_actividad = ?', [id_actividad]);
            res.json({ message: 'El estado de la actividad se ha actualizado' });
        } catch (error) {
            console.error('Error al modificar el estado de la actividad:', error);
            res.status(500).json({ message: 'Error al modificar el estado de la actividad' });
        }
    }

    public async obtenerComentariosActividad (req: Request, res: Response){
        const { id_actividad } = req.params
        const comentarios = await pool.query('SELECT * FROM comentario WHERE fk_actividad = ? order by fecha desc',[id_actividad]);
        res.json(comentarios);
    }

    public async registrarComentarioActividad(req: Request, res: Response): Promise<void> {
        try {
          const result = await pool.query('INSERT INTO comentario SET ?',[req.body]);
          res.status(201).json({ message: 'Se registró el comentario correctamente', insertedId: result.insertId });
        } catch (error) {
          console.error('Error al registrar el comentario:', error);
          res.status(500).json({ message: 'Error al registrar el comentario' });
        }
    }

    public async actividadesCumplidasProyecto (req: Request, res: Response){
        const { id_proyecto } = req.params
        const actividades = await pool.query('SELECT a.nombre, a.fecha_inicio, a.fecha_fin, a.fecha_termino, concat(u.nombre," ",u.ape_paterno," ",u.ape_materno) as usuario, fk_proyecto, pk_actividad FROM actividad as a INNER JOIN usuario as u ON a.fk_usuario = u.pk_usuario WHERE a.fk_proyecto = ? AND estado = 1 order by fecha_termino desc',[id_proyecto]);
        const cantidadResultados = actividades.length;
        res.json({ actividades, cantidadResultados });
    }

    public async actividadesCumplidasEmpleado (req: Request, res: Response){
        const { id_empleado } = req.params
        const actividades = await pool.query('SELECT a.nombre, a.fecha_inicio, a.fecha_fin, a.fecha_termino, p.nombre as nombre_proyecto, fk_proyecto, pk_actividad FROM actividad as a INNER JOIN proyecto as p ON a.fk_proyecto = p.pk_proyecto WHERE a.fk_usuario = ? AND a.estado = 1 order by a.fecha_termino desc',[id_empleado]);
        const cantidadResultados = actividades.length;
        res.json({ actividades, cantidadResultados });
    }

    public async actividadesPendientesProyecto (req: Request, res: Response){
        const { id_proyecto } = req.params
        const actividades = await pool.query('SELECT a.nombre, a.fecha_inicio, a.fecha_fin, a.fecha_termino, concat(u.nombre," ",u.ape_paterno," ",u.ape_materno) as usuario, fk_proyecto, pk_actividad FROM actividad as a INNER JOIN usuario as u ON a.fk_usuario = u.pk_usuario WHERE a.fk_proyecto = ? AND estado = 0 AND fecha_fin >= NOW() order by fecha_fin asc',[id_proyecto]);
        const cantidadResultados = actividades.length;
        res.json({ actividades, cantidadResultados });
    }

    public async actividadesPendientesEmpleado (req: Request, res: Response){
        const { id_empleado } = req.params
        const actividades = await pool.query('SELECT a.nombre, a.fecha_inicio, a.fecha_fin, a.fecha_termino, p.nombre as nombre_proyecto, fk_proyecto, pk_actividad FROM actividad as a INNER JOIN proyecto as p ON a.fk_proyecto = p.pk_proyecto WHERE a.fk_usuario = ? AND a.estado = 0 AND a.fecha_fin >= NOW() order by a.fecha_fin asc',[id_empleado]);
        const cantidadResultados = actividades.length;
        res.json({ actividades, cantidadResultados });
    }

    public async actividadesRetrasadasProyecto (req: Request, res: Response){
        const { id_proyecto } = req.params
        const actividades = await pool.query('SELECT a.nombre, a.fecha_inicio, a.fecha_fin, a.fecha_termino, concat(u.nombre," ",u.ape_paterno," ",u.ape_materno) as usuario, fk_proyecto, pk_actividad FROM actividad as a INNER JOIN usuario as u ON a.fk_usuario = u.pk_usuario WHERE a.fk_proyecto = ? AND a.estado = 0 AND a.fecha_fin < NOW() order by fecha_fin asc',[id_proyecto]);
        const cantidadResultados = actividades.length;
        res.json({ actividades, cantidadResultados });
    }

    public async actividadesRetrasadasEmpleado (req: Request, res: Response){
        const { id_empleado } = req.params
        const actividades = await pool.query('SELECT a.nombre, a.fecha_inicio, a.fecha_fin, a.fecha_termino, p.nombre as nombre_proyecto, fk_proyecto, pk_actividad FROM actividad as a INNER JOIN proyecto as p ON a.fk_proyecto = p.pk_proyecto WHERE a.fk_usuario = ? AND a.estado = 0 AND a.fecha_fin < NOW() order by a.fecha_fin asc',[id_empleado]);
        const cantidadResultados = actividades.length;
        res.json({ actividades, cantidadResultados });
    }
}

export const notaController = new NotaController();
export default notaController;