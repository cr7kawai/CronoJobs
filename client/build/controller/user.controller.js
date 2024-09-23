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
exports.userController = void 0;
const connection_1 = __importDefault(require("../connection"));
const nodemailer = require("nodemailer");
class UserController {
    obtenerUsuarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuarios = yield connection_1.default.query("SELECT u.pk_usuario, CONCAT(u.nombre,' ',u.ape_paterno,' ',u.ape_materno) AS nombre, u.genero, r.nombre as rol, a.nombre as area, u.email FROM usuario as u LEFT JOIN rol as r ON r.pk_rol = u.fk_rol LEFT JOIN area as a ON a.pk_area = u.fk_area ORDER BY CASE WHEN r.pk_rol = 4 THEN 1 ELSE 0 END, r.pk_rol ASC;");
            res.json(usuarios);
        });
    }
    obtenerRoles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const roles = yield connection_1.default.query("SELECT * FROM rol WHERE pk_rol != 1 AND pk_rol != 2 AND pk_rol !=3");
            res.json(roles);
        });
    }
    obtenerAreas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const areas = yield connection_1.default.query("SELECT * FROM area");
            res.json(areas);
        });
    }
    verUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_user } = req.params;
            const usuario = yield connection_1.default.query("SELECT * FROM usuario WHERE pk_usuario = ?", [id_user]);
            if (usuario.length > 0) {
                return res.json(usuario[0]);
            }
            res.status(404).json({ text: "El usuario no existe" });
        });
    }
    obtenerUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_user } = req.params;
            const usuario = yield connection_1.default.query("SELECT u.*, r.nombre as rol, a.nombre as area FROM usuario as u INNER JOIN area as a ON a.pk_area = u.fk_area INNER JOIN rol as r on r.pk_rol = u.fk_rol WHERE pk_usuario = ?", [id_user]);
            if (usuario.length > 0) {
                return res.json(usuario[0]);
            }
            res.status(404).json({ text: "El usuario no existe" });
        });
    }
    obtenerUsuariosArea(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_area } = req.params;
            const usuarios = yield connection_1.default.query("SELECT u.pk_usuario, concat(u.nombre,' ',u.ape_paterno,' ',u.ape_materno) as nombre, u.genero, r.nombre as rol, a.nombre as area, u.email FROM usuario as u LEFT JOIN rol as r ON r.pk_rol = u.fk_rol LEFT JOIN area as a ON a.pk_area = u.fk_area WHERE u.fk_area = ? order by r.pk_rol asc", [id_area]);
            if (usuarios.length > 0) {
                return res.json(usuarios);
            }
            res.status(404).json({ text: "No hay empleados en el área" });
        });
    }
    registrarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usuario = req.body;
                const result = yield connection_1.default.query("INSERT INTO usuario SET ?", [usuario]);
                const transporter = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: "almotors666@gmail.com",
                        pass: "qtsq kxpt neot gfow",
                    },
                });
                const mailOptions = {
                    from: "almotors666@gmail.com",
                    to: usuario.email,
                    subject: "Bienvenido a la aplicación de AL Motors",
                    html: `<H1>Hola ${usuario.nombre},</H1>
          <p>Tu usuario y contraseña para la aplicación de AL Motors son:</p>
          <p><strong>Usuario:</strong> ${usuario.email}</p>
          <p><strong>Contraseña:</strong> ${usuario.password}</p>
          <p>Gracias por unirte a nosotros.</p>`,
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error("Error al enviar el correo electrónico:", error);
                    }
                    else {
                        console.log("Correo electrónico enviado:", info.response);
                    }
                });
                res
                    .status(201)
                    .json({
                    message: "Se registró el usuario correctamente",
                    insertedId: result.insertId,
                });
            }
            catch (error) {
                console.error("Error al registrar el usuario:", error);
                res.status(500).json({ message: "Error al registrar el usuario" });
            }
        });
    }
    cambiarContrasena(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_user, email } = req.params;
                const usuario = req.body;
                yield connection_1.default.query("UPDATE usuario SET ? WHERE pk_usuario = ?", [
                    req.body,
                    id_user,
                ]);
                const transporter = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: "almotors666@gmail.com",
                        pass: "qtsq kxpt neot gfow",
                    },
                });
                const mailOptions = {
                    from: "almotors666@gmail.com",
                    to: email,
                    subject: "Contraseña cambiada en la aplicación de AL Motors",
                    html: `<h1>Hola!</h1>
            <p>Tu contraseña ha sido cambiada correctamente. Ahora tus datos de inicio de sesión son:</p>
            <p><strong>Usuario:</strong> ${email}</p>
            <p><strong>Contraseña:</strong> ${usuario.password}</p>
            <p>Gracias por utilizar la aplicación de AL Motors.</p>`,
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error("Error al enviar el correo electrónico:", error);
                    }
                    else {
                        console.log("Correo electrónico enviado:", info.response);
                    }
                });
                res.json({ message: "La contraseña ha sido actualizada" });
            }
            catch (error) {
                console.error("Error al cambiar la contraseña:", error);
                res.status(500).json({ message: "Error al cambiar la contraseña" });
            }
        });
    }
    modificarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_user } = req.params;
                yield connection_1.default.query("UPDATE usuario SET ? WHERE pk_usuario = ?", [
                    req.body,
                    id_user,
                ]);
                res.json({ message: "El usuario ha sido actualizado" });
            }
            catch (error) {
                console.error("Error al modificar el usuario:", error);
                res.status(500).json({ message: "Error al modificar el usuario" });
            }
        });
    }
    eliminarUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id_user } = req.params;
                yield connection_1.default.query("DELETE FROM usuario WHERE pk_usuario = ?", [id_user]);
                res.json({ message: "El usuario ha sido eliminado" });
            }
            catch (error) {
                console.error("Error al eliminar el usuario:", error);
                res.status(500).json({ message: "Error al eliminar el usuario" });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const result = yield connection_1.default.query("SELECT u.pk_usuario, concat(u.nombre,' ',u.ape_paterno,' ',u.ape_materno) as nombre, u.fk_rol, r.nombre as nombre_rol, u.fk_area FROM usuario as u INNER JOIN rol as r ON r.pk_rol = u.fk_rol WHERE u.email = ? and u.password = ?", [email, password]);
                if (result.length > 0) {
                    res
                        .status(200)
                        .json({ message: "El usuario se ha logueado", userData: result[0] });
                }
                else {
                    res.status(401).json({ message: "Credenciales incorrectas" });
                }
            }
            catch (error) {
                console.error("Error al iniciar sesión:", error);
                res.status(500).json({ message: "Error al iniciar sesión" });
            }
        });
    }
    enviarNotificacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield connection_1.default.query('INSERT INTO notificacion SET ?', [req.body]);
                res.status(201).json({ message: 'Se registró la notificación correctamente', insertedId: result.insertId });
            }
            catch (error) {
                console.error('Error al registrar el notificación:', error);
                res.status(500).json({ message: 'Error al registrar la notificación' });
            }
        });
    }
    obtenerNotificaciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_user } = req.params;
            const notificaciones = yield connection_1.default.query('SELECT * FROM notificacion WHERE fk_usuario = ?', [id_user]);
            if (notificaciones.length > 0) {
                return res.json(notificaciones);
            }
            res.status(404).json({ text: 'No hay notificaciones' });
        });
    }
}
exports.userController = new UserController();
exports.default = exports.userController;
