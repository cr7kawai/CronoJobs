import { Request, Response, text } from 'express';

import pool from '../connection';

class NotaController{

    public async obtenerNotas (req: Request, res: Response){
        const { id_proyecto } = req.params
        const notas = await pool.query('SELECT * FROM nota WHERE fk_proyecto = ? order by prioridad asc',[id_proyecto]);
        res.json(notas);
    }

    public async registrarNota(req: Request, res: Response): Promise<void> {
        try {
          const result = await pool.query('INSERT INTO nota SET ?',[req.body]);
          res.status(201).json({ message: 'Se registró la nota correctamente', insertedId: result.insertId });
        } catch (error) {
          console.error('Error al registrar la nota:', error);
          res.status(500).json({ message: 'Error al registrar la nota' });
        }
    }
      
    public async modificarNota(req: Request, res: Response): Promise<void> {
        try {
          const { id_nota } = req.params;
          await pool.query('UPDATE nota SET ? WHERE pk_nota = ?', [req.body, id_nota]);
          res.json({ message: 'La nota ha sido actualizado' });
        } catch (error) {
          console.error('Error al modificar la nota:', error);
          res.status(500).json({ message: 'Error al modificar la nota' });
        }
    }
      
    public async eliminarNota(req: Request, res: Response): Promise<void> {
        try {
          const { id_nota } = req.params;
          await pool.query('DELETE FROM nota WHERE pk_nota = ?', [id_nota]);
          res.json({ message: 'La nota ha sido eliminada' });
        } catch (error) {
          console.error('Error al eliminar la nota:', error);
          res.status(500).json({ message: 'Error al eliminar la nota' });
        }
    }
}

export const notaController = new NotaController();
export default notaController;