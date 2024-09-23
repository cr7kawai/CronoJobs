"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notaController = void 0;
const connection_1 = __importDefault(require("../connection"));
class NotaController {
    obtenerActividades(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_proyecto } = req.params;
            const actividades = yield connection_1.default.query('SELECT pk_actividad, nombre, descripcion, fecha_inicio, fecha_fin, fecha_termino, CASE estado WHEN 0 THEN "Pendiente" WHEN 1 THEN "Realizado" END AS estado, fk_proyecto FROM actividad WHERE fk_proyecto = ? order by fecha_termino desc', [id_proyecto]);
            res.json(actividades);
        });
    }
    obtenerActividadesEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_proyecto } = req.params;
            const { id_usuario } = req.params;
            const actividades = yield connection_1.default.query('SELECT pk_actividad, nombre, descripcion, fecha_inicio, fecha_fin, fecha_termino, CASE estado WHEN 0 THEN "Pendiente" WHEN 1 THEN "Realizado" END AS estado, fk_proyecto FROM actividad WHERE fk_proyecto = ? and fk_usuario = ? order by fecha_termino desc', [id_proyecto, id_usuario]);
            res.json(actividades);
        });
    }
    verActividad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_actividad } = req.params;
            const actividad = yield connection_1.default.query('SELECT a.pk_actividad, a.nombre as actividad, a.descripcion, a.fecha_inicio, a.fecha_fin, a.fecha_termino, CASE a.estado WHEN 0 THEN "Pendiente" WHEN 1 THEN "Realizado" END AS estado, u.nombre, u.ape_paterno, u.ape_materno, p.nombre as proyecto FROM actividad as a INNER JOIN usuario as u ON u.pk_usuario = a.fk_usuario INNER JOIN proyecto as p ON p.pk_proyecto = a.fk_proyecto WHERE pk_actividad = ?', [id_actividad]);
            if (actividad.length > 0) {
                return res.json(actividad[0]);
            }
            res.status(404).json({ text: "La actividad no existe" });
        });
    }
    obtenerActividad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_actividad } = req.params;
            const actividad = yield connection_1.default.query('SELECT * FROM actividad WHERE pk_actividad = ?', [id_actividad]);
            if (actividad.length > 0) {
                return res.json(actividad[0]);
            }
            res.status(404).json({ text: "La actividad no existe" });
        });
    }
    actividadesNoCumplidasProyecto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_proyecto } = req.params;
            const actividades = yield connection_1.default.query('SELECT * FROM actividad WHERE fk_proyecto = ? AND estado = 0 order by fecha_fin asc', [id_proyecto]);
            res.json(actividades);
        });
    }
    registrarActividad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield connection_1.default.query('INSERT INTO actividad SET ?', [req.body]);
                res.status(201).json({ message: 'Se registró la actividad correctamente', insertedId: result.insertId });
            }
            catch (error) {
                console.error('Error al registrar la actividad:', error);
                res.status(500).json({ message: 'Error al registrar la actividad' });
            }
        });
    }
    modificarActividad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_actividad } = req.params;
                yield connection_1.default.query('UPDATE actividad SET ? WHERE pk_actividad = ?', [req.body, id_actividad]);
                res.json({ message: 'La actividad ha sido actualizado' });
            }
            catch (error) {
                console.error('Error al modificar la actividad:', error);
                res.status(500).json({ message: 'Error al modificar la actividad' });
            }
        });
    }
    eliminarActividad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_actividad } = req.params;
                yield connection_1.default.query('DELETE FROM comentario WHERE fk_actividad = ?', [id_actividad]);
                yield connection_1.default.query('DELETE FROM actividad WHERE pk_actividad = ?', [id_actividad]);
                res.json({ message: 'La actividad ha sido eliminada' });
            }
            catch (error) {
                console.error('Error al eliminar la actividad:', error);
                res.status(500).json({ message: 'Error al eliminar la actividad' });
            }
        });
    }
    actividadesCumplidasEmplProy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_proyecto, id_empleado } = req.params;
            const actividades = yield connection_1.default.query('SELECT * FROM actividad WHERE fk_proyecto = ? and fk_usuario = ? and estado = 1 order by fecha_termino desc', [id_proyecto, id_empleado]);
            res.json(actividades);
        });
    }
    actividadesNoCumplidasEmplProy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_proyecto, id_empleado } = req.params;
            const actividades = yield connection_1.default.query('SELECT * FROM actividad WHERE fk_proyecto = ? and fk_usuario = ? and estado = 0 order by fecha_fin asc', [id_proyecto, id_empleado]);
            res.json(actividades);
        });
    }
    actualizarEstadoActividad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_actividad } = req.params;
                yield connection_1.default.query('UPDATE actividad SET estado = 1, fecha_termino = NOW() WHERE pk_actividad = ?', [id_actividad]);
                res.json({ message: 'El estado de la actividad se ha actualizado' });
            }
            catch (error) {
                console.error('Error al modificar el estado de la actividad:', error);
                res.status(500).json({ message: 'Error al modificar el estado de la actividad' });
            }
        });
    }
    obtenerComentariosActividad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_actividad } = req.params;
            const comentarios = yield connection_1.default.query('SELECT * FROM comentario WHERE fk_actividad = ? order by fecha desc', [id_actividad]);
            res.json(comentarios);
        });
    }
    registrarComentarioActividad(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield connection_1.default.query('INSERT INTO comentario SET ?', [req.body]);
                res.status(201).json({ message: 'Se registró el comentario correctamente', insertedId: result.insertId });
            }
            catch (error) {
                console.error('Error al registrar el comentario:', error);
                res.status(500).json({ message: 'Error al registrar el comentario' });
            }
        });
    }
    actividadesCumplidasProyecto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_proyecto } = req.params;
            const actividades = yield connection_1.default.query('SELECT a.nombre, a.fecha_inicio, a.fecha_fin, a.fecha_termino, concat(u.nombre," ",u.ape_paterno," ",u.ape_materno) as usuario, fk_proyecto, pk_actividad FROM actividad as a INNER JOIN usuario as u ON a.fk_usuario = u.pk_usuario WHERE a.fk_proyecto = ? AND estado = 1 order by fecha_termino desc', [id_proyecto]);
            const cantidadResultados = actividades.length;
            res.json({ actividades, cantidadResultados });
        });
    }
    actividadesCumplidasEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const actividades = yield connection_1.default.query('SELECT a.nombre, a.fecha_inicio, a.fecha_fin, a.fecha_termino, p.nombre as nombre_proyecto, fk_proyecto, pk_actividad FROM actividad as a INNER JOIN proyecto as p ON a.fk_proyecto = p.pk_proyecto WHERE a.fk_usuario = ? AND a.estado = 1 order by a.fecha_termino desc', [id_empleado]);
            const cantidadResultados = actividades.length;
            res.json({ actividades, cantidadResultados });
        });
    }
    actividadesPendientesProyecto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_proyecto } = req.params;
            const actividades = yield connection_1.default.query('SELECT a.nombre, a.fecha_inicio, a.fecha_fin, a.fecha_termino, concat(u.nombre," ",u.ape_paterno," ",u.ape_materno) as usuario, fk_proyecto, pk_actividad FROM actividad as a INNER JOIN usuario as u ON a.fk_usuario = u.pk_usuario WHERE a.fk_proyecto = ? AND estado = 0 AND fecha_fin >= NOW() order by fecha_fin asc', [id_proyecto]);
            const cantidadResultados = actividades.length;
            res.json({ actividades, cantidadResultados });
        });
    }
    actividadesPendientesEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const actividades = yield connection_1.default.query('SELECT a.nombre, a.fecha_inicio, a.fecha_fin, a.fecha_termino, p.nombre as nombre_proyecto, fk_proyecto, pk_actividad FROM actividad as a INNER JOIN proyecto as p ON a.fk_proyecto = p.pk_proyecto WHERE a.fk_usuario = ? AND a.estado = 0 AND a.fecha_fin >= NOW() order by a.fecha_fin asc', [id_empleado]);
            const cantidadResultados = actividades.length;
            res.json({ actividades, cantidadResultados });
        });
    }
    actividadesRetrasadasProyecto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_proyecto } = req.params;
            const actividades = yield connection_1.default.query('SELECT a.nombre, a.fecha_inicio, a.fecha_fin, a.fecha_termino, concat(u.nombre," ",u.ape_paterno," ",u.ape_materno) as usuario, fk_proyecto, pk_actividad FROM actividad as a INNER JOIN usuario as u ON a.fk_usuario = u.pk_usuario WHERE a.fk_proyecto = ? AND a.estado = 0 AND a.fecha_fin < NOW() order by fecha_fin asc', [id_proyecto]);
            const cantidadResultados = actividades.length;
            res.json({ actividades, cantidadResultados });
        });
    }
    actividadesRetrasadasEmpleado(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empleado } = req.params;
            const actividades = yield connection_1.default.query('SELECT a.nombre, a.fecha_inicio, a.fecha_fin, a.fecha_termino, p.nombre as nombre_proyecto, fk_proyecto, pk_actividad FROM actividad as a INNER JOIN proyecto as p ON a.fk_proyecto = p.pk_proyecto WHERE a.fk_usuario = ? AND a.estado = 0 AND a.fecha_fin < NOW() order by a.fecha_fin asc', [id_empleado]);
            const cantidadResultados = actividades.length;
            res.json({ actividades, cantidadResultados });
        });
    }
}
exports.notaController = new NotaController();
exports.default = exports.notaController;
