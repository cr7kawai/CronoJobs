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
function verificarActividadesYRegistrarNotificaciones() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const fechaActual = new Date();
            const resultados = yield connection_1.default.query('SELECT nombre, fk_usuario FROM actividad WHERE estado = 0 AND fecha_fin < ?', [fechaActual]);
            console.log(resultados);
            if (resultados.length > 0) {
                resultados.forEach((actividad) => __awaiter(this, void 0, void 0, function* () {
                    const notificacion = {
                        fecha: fechaActual,
                        comentario: `La actividad con nombre: ${actividad.nombre}. Ha pasado su fecha de término.`,
                        fk_usuario: actividad.fk_usuario,
                    };
                    yield connection_1.default.query('INSERT INTO notificacion SET ?', [notificacion]);
                }));
                console.log('Notificaciones registradas para actividades retrasadas.');
            }
            else {
                console.log('No hay actividades retrasadas para notificar.');
            }
        }
        catch (error) {
            console.error('Error al verificar actividades y registrar notificaciones:', error);
        }
    });
}
verificarActividadesYRegistrarNotificaciones();
