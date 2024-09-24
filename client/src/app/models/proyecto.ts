export interface Proyecto{
    pk_proyecto?: number,
    nombre?: string,
    descripcion?: string,
    fecha_inicio?: any,
    fecha_fin?: any,
    estado?: Boolean,
    fecha_termino?: any
    fk_area?: number
}