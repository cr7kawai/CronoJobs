export interface Nota {
    pk_nota?: number;
    nombre?: string;
    descripcion?: string;
    prioridad?: number;
    fecha?: any;
    fk_proyecto?: number;
};