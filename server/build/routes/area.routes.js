"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const area_controller_1 = __importDefault(require("../controller/area.controller"));
class AreaRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/:id_empresa', area_controller_1.default.obtenerAreas);
        this.router.get('/verUna/:id_area', area_controller_1.default.verArea);
        this.router.post('/', area_controller_1.default.registrarArea);
        this.router.put('/:id_area', area_controller_1.default.modificarArea);
        this.router.delete('/:id_area', area_controller_1.default.eliminarArea);
    }
}
const areaRoutes = new AreaRoutes();
exports.default = areaRoutes.router;
