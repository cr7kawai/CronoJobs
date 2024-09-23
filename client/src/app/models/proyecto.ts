export interface Proyecto{
    pk_proyecto?: number,
    nombre?: string,
    descripcion?: string,
    fecha_inicio?: Date,
    fecha_fin?: Date,
    estado?: Boolean,
    fecha_termino?: Date
    fk_area?: number
}