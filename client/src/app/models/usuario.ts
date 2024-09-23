export interface Usuario{
    pk_usuario?: number,
    nombre?: string,
    ape_paterno?: string,
    ape_materno?: string,
    email?: string,
    password?: string,
    telefono?: string, 
    genero?: string,
    fecha_nacimiento?: Date
    fk_rol?: number
    fk_area?: number
}