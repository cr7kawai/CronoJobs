import pool from '../connection';

async function verificarActividadesYRegistrarNotificaciones() {
  try {
    const fechaActual = new Date();
    const resultados = await pool.query('SELECT nombre, fk_usuario FROM actividad WHERE estado = 0 AND fecha_fin < ?', [fechaActual]);
    console.log(resultados)
    if (resultados.length > 0) {
      resultados.forEach(async (actividad: any) => {
        const notificacion = {
          fecha: fechaActual,
          comentario: `La actividad con nombre: ${actividad.nombre}. Ha pasado su fecha de término.`,
          fk_usuario: actividad.fk_usuario,
        };

        await pool.query('INSERT INTO notificacion SET ?', [notificacion]);
      });
      console.log('Notificaciones registradas para actividades retrasadas.');
    } else {
      console.log('No hay actividades retrasadas para notificar.');
    }
  } catch (error) {
    console.error('Error al verificar actividades y registrar notificaciones:', error);
  }
}

verificarActividadesYRegistrarNotificaciones();
