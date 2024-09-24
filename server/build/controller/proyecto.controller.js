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
exports.proyectoController = void 0;
const connection_1 = __importDefault(require("../connection"));
class ProyectoController {
    obtenerProyectos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empresa } = req.params;
            const proyectos = yield connection_1.default.query('SELECT pk_proyecto, p.nombre, descripcion, fecha_inicio, fecha_fin, CASE p.estado WHEN 0 THEN "Pendiente" WHEN 1 THEN "Realizado" END AS estado, fecha_termino, a.nombre as area FROM proyecto as p INNER JOIN area as a on a.pk_area = p.fk_area INNER JOIN empresa as e on e.pk_empresa = a.fk_empresa WHERE e.pk_empresa = ? order by fecha_termino asc', [id_empresa]);
            res.json(proyectos);
        });
    }
    verProyecto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_proyecto } = req.params;
            const proyecto = yield connection_1.default.query('Select p.*, u.pk_usuario from proyecto as p INNER JOIN usuario as u ON p.fk_area = u.fk_area WHERE p.pk_proyecto = ? AND u.fk_rol =3', [id_proyecto]);
            if (proyecto.length > 0) {
                return res.json(proyecto[0]);
            }
            res.status(404).json({ text: "El proyecto no existe" });
        });
    }
    obtenerProyecto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_proyecto } = req.params;
            const proyecto = yield connection_1.default.query('SELECT pk_proyecto, p.nombre, descripcion, fecha_inicio, fecha_fin, CASE estado WHEN 0 THEN "Pendiente" WHEN 1 THEN "Realizado" END AS estado, fecha_termino, a.nombre as area FROM proyecto as p INNER JOIN area as a on pk_area = fk_area WHERE pk_proyecto = ?', [id_proyecto]);
            if (proyecto.length > 0) {
                return res.json(proyecto[0]);
            }
            res.status(404).json({ text: "El proyecto no existe" });
        });
    }
    obtenerProyectosArea(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_area } = req.params;
            const proyectos = yield connection_1.default.query('SELECT pk_proyecto, p.nombre, descripcion, fecha_inicio, fecha_fin, CASE estado WHEN 0 THEN "Pendiente" WHEN 1 THEN "Realizado" END AS estado, fecha_termino, a.nombre as area FROM proyecto as p INNER JOIN area as a on pk_area = fk_area WHERE pk_area = ? order by fecha_termino asc', [id_area]);
            if (proyectos.length > 0) {
                return res.json(proyectos);
            }
            res.status(404).json({ text: 'No hay proyectos en el área' });
        });
    }
    registrarProyecto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield connection_1.default.query('INSERT INTO proyecto SET ?', [req.body]);
                res.status(201).json({ message: 'Se registró el proyecto correctamente', insertedId: result.insertId });
            }
            catch (error) {
                console.error('Error al registrar el proyecto:', error);
                res.status(500).json({ message: 'Error al registrar el proyecto' });
            }
        });
    }
    modificarProyecto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_proyecto } = req.params;
                yield connection_1.default.query('UPDATE proyecto SET ? WHERE pk_proyecto = ?', [req.body, id_proyecto]);
                res.json({ message: 'El proyecto ha sido actualizado' });
            }
            catch (error) {
                console.error('Error al modificar el proyecto:', error);
                res.status(500).json({ message: 'Error al modificar el proyecto' });
            }
        });
    }
    terminarProyecto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_proyecto } = req.params;
                yield connection_1.default.query('UPDATE proyecto SET estado = 1, fecha_termino = NOW() WHERE pk_proyecto = ?', [id_proyecto]);
                res.json({ message: 'El proyecto ha sido completado' });
            }
            catch (error) {
                console.error('Error al completar el proyecto:', error);
                res.status(500).json({ message: 'Error al completar el proyecto' });
            }
        });
    }
    eliminarProyecto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_proyecto } = req.params;
                yield connection_1.default.query('DELETE FROM nota WHERE fk_proyecto = ?', [id_proyecto]);
                yield connection_1.default.query('DELETE c FROM comentario AS c WHERE c.fk_actividad IN (SELECT a.pk_actividad FROM actividad AS a WHERE a.fk_proyecto = ?)', [id_proyecto]);
                yield connection_1.default.query('DELETE FROM actividad WHERE fk_proyecto = ?', [id_proyecto]);
                yield connection_1.default.query('DELETE FROM proyecto WHERE pk_proyecto = ?', [id_proyecto]);
                res.json({ message: 'El proyecto ha sido eliminado' });
            }
            catch (error) {
                console.error('Error al eliminar el proyecto:', error);
                res.status(500).json({ message: 'Error al eliminar el proyecto' });
            }
        });
    }
}
exports.proyectoController = new ProyectoController();
exports.default = exports.proyectoController;
