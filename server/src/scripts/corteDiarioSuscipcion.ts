import pool from '../connection';

async function actualizarEmpresas() {
  const fechaActual = new Date();

  // Obtener la fecha de hace 30 días
  const fecha30DiasAtras = new Date(fechaActual);
  fecha30DiasAtras.setDate(fecha30DiasAtras.getDate() - 30);

  try {
    // Seleccionar empresas con fecha de suscripción hace 30 días o más
    const resultados = await pool.query('SELECT pk_empresa FROM al_motors.empresa WHERE fecha_suscripcion <= ?', [fecha30DiasAtras]);

    if (resultados.length > 0) {
      for (const empresa of resultados) {
        // Actualizar la fecha de suscripción y fk_suscripcion
        await pool.query('UPDATE al_motors.empresa SET fecha_suscripcion = ?, fk_suscripcion = 1 WHERE pk_empresa = ?', [fechaActual, empresa.pk_empresa]);
      }

      console.log('Empresas actualizadas exitosamente.');
    } else {
      console.log('No hay empresas para actualizar.');
    }
  } catch (error) {
    console.error('Error al actualizar empresas:', error);
  }
}

actualizarEmpresas();