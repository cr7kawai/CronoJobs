import { Request, Response } from "express";
import pool from "../connection";

const nodemailer = require("nodemailer");

class UserController {

  public async obtenerUsuarios(req: Request, res: Response) {
    const usuarios = await pool.query("SELECT u.pk_usuario, CONCAT(u.nombre,' ',u.ape_paterno,' ',u.ape_materno) AS nombre, u.genero, r.nombre as rol, a.nombre as area, u.email FROM usuario as u LEFT JOIN rol as r ON r.pk_rol = u.fk_rol LEFT JOIN area as a ON a.pk_area = u.fk_area ORDER BY CASE WHEN r.pk_rol = 4 THEN 1 ELSE 0 END, r.pk_rol ASC;");
    res.json(usuarios);
  }

  public async obtenerRoles(req: Request, res: Response){
    const roles = await pool.query("SELECT * FROM rol WHERE pk_rol != 1 AND pk_rol != 2 AND pk_rol !=3");
    res.json(roles);
  }

  public async obtenerAreas(req: Request, res: Response){
    const areas = await pool.query("SELECT * FROM area");
    res.json(areas);
  }

  public async verUsuario(req: Request, res: Response): Promise<any> {
    const { id_user } = req.params;
    const usuario = await pool.query(
      "SELECT * FROM usuario WHERE pk_usuario = ?",
      [id_user]
    );
    if (usuario.length > 0) {
      return res.json(usuario[0]);
    }
    res.status(404).json({ text: "El usuario no existe" });
  }

  public async obtenerUsuario(req: Request, res: Response): Promise<any> {
    const { id_user } = req.params;
    const usuario = await pool.query(
      "SELECT u.*, r.nombre as rol, a.nombre as area FROM usuario as u INNER JOIN area as a ON a.pk_area = u.fk_area INNER JOIN rol as r on r.pk_rol = u.fk_rol WHERE pk_usuario = ?",
      [id_user]
    );
    if (usuario.length > 0) {
      return res.json(usuario[0]);
    }
    res.status(404).json({ text: "El usuario no existe" });
  }

  public async obtenerUsuariosArea(req: Request, res: Response): Promise<any> {
    const { id_area } = req.params;
    const usuarios = await pool.query(
      "SELECT u.pk_usuario, concat(u.nombre,' ',u.ape_paterno,' ',u.ape_materno) as nombre, u.genero, r.nombre as rol, a.nombre as area, u.email FROM usuario as u LEFT JOIN rol as r ON r.pk_rol = u.fk_rol LEFT JOIN area as a ON a.pk_area = u.fk_area WHERE u.fk_area = ? order by r.pk_rol asc",
      [id_area]
    );
    if (usuarios.length > 0) {
      return res.json(usuarios);
    }
    res.status(404).json({ text: "No hay empleados en el área" });
  }

  public async registrarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const usuario = req.body;

      const result = await pool.query("INSERT INTO usuario SET ?", [usuario]);

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

      transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
          console.error("Error al enviar el correo electrónico:", error);
        } else {
          console.log("Correo electrónico enviado:", info.response);
        }
      });

      res
        .status(201)
        .json({
          message: "Se registró el usuario correctamente",
          insertedId: result.insertId,
        });
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      res.status(500).json({ message: "Error al registrar el usuario" });
    }
  }

  public async cambiarContrasena(req: Request, res: Response): Promise<void> {
    try {
      const { id_user, email } = req.params;
      const usuario = req.body;
      await pool.query("UPDATE usuario SET ? WHERE pk_usuario = ?", [
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

      transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
          console.error("Error al enviar el correo electrónico:", error);
        } else {
          console.log("Correo electrónico enviado:", info.response);
        }
      });

      res.json({ message: "La contraseña ha sido actualizada" });
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      res.status(500).json({ message: "Error al cambiar la contraseña" });
    }
  }

  public async modificarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { id_user } = req.params;
      await pool.query("UPDATE usuario SET ? WHERE pk_usuario = ?", [
        req.body,
        id_user,
      ]);
      res.json({ message: "El usuario ha sido actualizado" });
    } catch (error) {
      console.error("Error al modificar el usuario:", error);
      res.status(500).json({ message: "Error al modificar el usuario" });
    }
  }

  public async eliminarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const { id_user } = req.params;
      await pool.query("DELETE FROM usuario WHERE pk_usuario = ?", [id_user]);
      res.json({ message: "El usuario ha sido eliminado" });
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      res.status(500).json({ message: "Error al eliminar el usuario" });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await pool.query(
        "SELECT u.pk_usuario, concat(u.nombre,' ',u.ape_paterno,' ',u.ape_materno) as nombre, u.fk_rol, r.nombre as nombre_rol, u.fk_area FROM usuario as u INNER JOIN rol as r ON r.pk_rol = u.fk_rol WHERE u.email = ? and u.password = ?",
        [email, password]
      );

      if (result.length > 0) {
        res
          .status(200)
          .json({ message: "El usuario se ha logueado", userData: result[0] });
      } else {
        res.status(401).json({ message: "Credenciales incorrectas" });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      res.status(500).json({ message: "Error al iniciar sesión" });
    }
  }

  public async enviarNotificacion(req: Request, res: Response): Promise<void> {
    try {
      const result = await pool.query('INSERT INTO notificacion SET ?',[req.body]);
      res.status(201).json({ message: 'Se registró la notificación correctamente', insertedId: result.insertId });
    } catch (error) {
      console.error('Error al registrar el notificación:', error);
      res.status(500).json({ message: 'Error al registrar la notificación' });
    }
  }

  public async obtenerNotificaciones (req: Request, res: Response): Promise<any>{
      const { id_user } = req.params;
      const notificaciones = await pool.query('SELECT * FROM notificacion WHERE fk_usuario = ?', [id_user]);
      if(notificaciones.length > 0){
          return res.json(notificaciones)
      }
      res.status(404).json({text: 'No hay notificaciones'});
  }
}

export const userController = new UserController();
export default userController;
