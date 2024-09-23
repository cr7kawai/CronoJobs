"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const proyecto_routes_1 = __importDefault(require("./routes/proyecto.routes"));
const nota_routes_1 = __importDefault(require("./routes/nota.routes"));
const actividad_routes_1 = __importDefault(require("./routes/actividad.routes"));
const recurso_routes_1 = __importDefault(require("./routes/recurso.routes"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    config() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use('/api/user', user_routes_1.default);
        this.app.use('/api/proyecto', proyecto_routes_1.default);
        this.app.use('/api/nota', nota_routes_1.default);
        this.app.use('/api/actividad', actividad_routes_1.default);
        this.app.use('/api/recurso', recurso_routes_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
