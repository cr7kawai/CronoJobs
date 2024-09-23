export interface Actividad {
    pk_actividad?: number;
    nombre?: string;
    descripcion?: string;
    fecha_inicio?: Date;
    fecha_fin?: Date;
    estado?: boolean;
    fecha_termino?: Date;
    fk_proyecto?: number;
    fk_usuario?: number;
};