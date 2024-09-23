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
    obtenerNotas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_proyecto } = req.params;
            const notas = yield connection_1.default.query('SELECT * FROM nota WHERE fk_proyecto = ? order by prioridad asc', [id_proyecto]);
            res.json(notas);
        });
    }
    registrarNota(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield connection_1.default.query('INSERT INTO nota SET ?', [req.body]);
                res.status(201).json({ message: 'Se registró la nota correctamente', insertedId: result.insertId });
            }
            catch (error) {
                console.error('Error al registrar la nota:', error);
                res.status(500).json({ message: 'Error al registrar la nota' });
            }
        });
    }
    modificarNota(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_nota } = req.params;
                yield connection_1.default.query('UPDATE nota SET ? WHERE pk_nota = ?', [req.body, id_nota]);
                res.json({ message: 'La nota ha sido actualizado' });
            }
            catch (error) {
                console.error('Error al modificar la nota:', error);
                res.status(500).json({ message: 'Error al modificar la nota' });
            }
        });
    }
    eliminarNota(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_nota } = req.params;
                yield connection_1.default.query('DELETE FROM nota WHERE pk_nota = ?', [id_nota]);
                res.json({ message: 'La nota ha sido eliminada' });
            }
            catch (error) {
                console.error('Error al eliminar la nota:', error);
                res.status(500).json({ message: 'Error al eliminar la nota' });
            }
        });
    }
}
exports.notaController = new NotaController();
exports.default = exports.notaController;
