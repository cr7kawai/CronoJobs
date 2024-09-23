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
exports.recursoController = void 0;
const connection_1 = __importDefault(require("../connection"));
class RecursoContoller {
    obtenerSolicitudRecursos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_proyecto } = req.params;
            const notas = yield connection_1.default.query('SELECT pk_solicitud, titulo, descripcion, fecha_solicitud, CASE estado WHEN 0 THEN "Pendiente" WHEN 1 THEN "Aceptado" WHEN 2 THEN "Rechazado" END AS estado, fecha_aprobacion, fk_proyecto FROM solicitud_recursos WHERE fk_proyecto = ? order by estado asc', [id_proyecto]);
            res.json(notas);
        });
    }
    recgistrarSolicitudRecursos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield connection_1.default.query('INSERT INTO solicitud_recursos SET ?', [req.body]);
                res.status(201).json({ message: 'Se registró la solicitud correctamente', insertedId: result.insertId });
            }
            catch (error) {
                console.error('Error al registrar la solicitud:', error);
                res.status(500).json({ message: 'Error al registrar la solicitud' });
            }
        });
    }
    obtenerSolicitud(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_solicitud } = req.params;
            const solicitud = yield connection_1.default.query('SELECT pk_solicitud, titulo, descripcion, fecha_solicitud, CASE estado WHEN 0 THEN "Pendiente" WHEN 1 THEN "Aceptado" WHEN 2 THEN "Rechazado" END AS estado, fecha_aprobacion, comentario, fk_proyecto FROM solicitud_recursos WHERE pk_solicitud = ?', [id_solicitud]);
            res.json(solicitud);
        });
    }
    modificarSolicitud(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_solicitud } = req.params;
                yield connection_1.default.query('UPDATE solicitud_recursos SET ? WHERE pk_solicitud = ?', [req.body, id_solicitud]);
                res.json({ message: 'La solicitud ha sido actualizado' });
            }
            catch (error) {
                console.error('Error al modificar la solicitud:', error);
                res.status(500).json({ message: 'Error al modificar la solicitud' });
            }
        });
    }
    eliminarSolicitud(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_solicitud } = req.params;
                yield connection_1.default.query('DELETE FROM solicitud_recursos WHERE pk_solicitud = ?', [id_solicitud]);
                res.json({ message: 'La solicitud ha sido eliminada' });
            }
            catch (error) {
                console.error('Error al eliminar la solicitud:', error);
                res.status(500).json({ message: 'Error al eliminar la solicitud' });
            }
        });
    }
}
exports.recursoController = new RecursoContoller();
exports.default = exports.recursoController;
