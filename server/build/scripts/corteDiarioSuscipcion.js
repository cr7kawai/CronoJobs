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
const connection_1 = __importDefault(require("../connection"));
function actualizarEmpresas() {
    return __awaiter(this, void 0, void 0, function* () {
        const fechaActual = new Date();
        // Obtener la fecha de hace 30 días
        const fecha30DiasAtras = new Date(fechaActual);
        fecha30DiasAtras.setDate(fecha30DiasAtras.getDate() - 30);
        try {
            // Seleccionar empresas con fecha de suscripción hace 30 días o más
            const resultados = yield connection_1.default.query('SELECT pk_empresa FROM al_motors.empresa WHERE fecha_suscripcion <= ?', [fecha30DiasAtras]);
            if (resultados.length > 0) {
                for (const empresa of resultados) {
                    // Actualizar la fecha de suscripción y fk_suscripcion
                    yield connection_1.default.query('UPDATE al_motors.empresa SET fecha_suscripcion = ?, fk_suscripcion = 1 WHERE pk_empresa = ?', [fechaActual, empresa.pk_empresa]);
                }
                console.log('Empresas actualizadas exitosamente.');
            }
            else {
                console.log('No hay empresas para actualizar.');
            }
        }
        catch (error) {
            console.error('Error al actualizar empresas:', error);
        }
    });
}
actualizarEmpresas();
