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
exports.areaController = void 0;
const connection_1 = __importDefault(require("../connection"));
class AreaController {
    obtenerAreas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empresa } = req.params;
            const areas = yield connection_1.default.query('SELECT * FROM area WHERE fk_empresa = ?', [id_empresa]);
            res.json(areas);
        });
    }
    verArea(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_area } = req.params;
            const area = yield connection_1.default.query('SELECT * FROM area WHERE pk_area = ?', [id_area]);
            if (area.length > 0) {
                return res.json(area[0]);
            }
            res.status(404).json({ text: "El equipo/área no existe" });
        });
    }
    registrarArea(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield connection_1.default.query('INSERT INTO area SET ?', [req.body]);
                res.status(201).json({ message: 'Se registró el área/equipo correctamente', insertedId: result.insertId });
            }
            catch (error) {
                console.error('Error al registrar el área/equipo:', error);
                res.status(500).json({ message: 'Error al registrar el área/equipo' });
            }
        });
    }
    modificarArea(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_area } = req.params;
                yield connection_1.default.query('UPDATE area SET ? WHERE pk_area = ?', [req.body, id_area]);
                res.json({ message: 'El área/equipo ha sido actualizado' });
            }
            catch (error) {
                console.error('Error al modificar el área/equipo:', error);
                res.status(500).json({ message: 'Error al modificar el área/equipo' });
            }
        });
    }
    eliminarArea(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_area } = req.params;
                yield connection_1.default.query('DELETE FROM area WHERE pk_area = ?', [id_area]);
                res.json({ message: 'El área/equipo ha sido eliminada' });
            }
            catch (error) {
                console.error('Error al eliminar el área/equipo:', error);
                res.status(500).json({ message: 'Error al eliminar el área/equipo' });
            }
        });
    }
}
exports.areaController = new AreaController();
exports.default = exports.areaController;
