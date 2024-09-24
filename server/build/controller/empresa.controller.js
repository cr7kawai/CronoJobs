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
exports.empresaController = void 0;
const connection_1 = __importDefault(require("../connection"));
class EmpresaController {
    obtenerEmpresas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresas = yield connection_1.default.query('SELECT * FROM empresa');
            res.json(empresas);
        });
    }
    filtrarEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_empresa } = req.params;
            const empresa = yield connection_1.default.query('SELECT * FROM empresa WHERE pk_empresa = ?', [id_empresa]);
            res.json(empresa);
        });
    }
    registrarEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield connection_1.default.query('INSERT INTO empresa SET ?', [req.body]);
                res.status(200).json({ message: 'Se registró la empresa correctamente', insertedId: result.insertId });
            }
            catch (error) {
                console.error('Error al registrar la empresa:', error);
                res.status(500).json({ message: 'Error al registrar la empresa' });
            }
        });
    }
    modificarEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_empresa } = req.params;
                yield connection_1.default.query('UPDATE empresa SET ? WHERE pk_empresa = ?', [req.body, id_empresa]);
                res.json({ message: 'La empresa ha sido actualizado' });
            }
            catch (error) {
                console.error('Error al modificar la empresa:', error);
                res.status(500).json({ message: 'Error al modificar la empresa' });
            }
        });
    }
    eliminarEmpresa(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_empresa } = req.params;
                yield connection_1.default.query('DELETE FROM empresa WHERE pk_empresa = ?', [id_empresa]);
                res.json({ message: 'La empresa ha sido eliminada' });
            }
            catch (error) {
                console.error('Error al eliminar la empresa:', error);
                res.status(500).json({ message: 'Error al eliminar la empresa' });
            }
        });
    }
}
exports.empresaController = new EmpresaController();
exports.default = exports.empresaController;
