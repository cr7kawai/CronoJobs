import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import userRoutes from './routes/user.routes';
import proyectoRoutes from './routes/proyecto.routes';
import notaRoutes from './routes/nota.routes';
import actividadRoutes from './routes/actividad.routes';
import recursoRoutes from './routes/recurso.routes';

class Server {

    public app: Application;
    
    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config(): void {
        this.app.set('port', process.env.PORT || 3000);

        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
    }

    routes(): void {
        this.app.use('/api/user', userRoutes);
        this.app.use('/api/proyecto',proyectoRoutes);
        this.app.use('/api/nota',notaRoutes);
        this.app.use('/api/actividad',actividadRoutes);
        this.app.use('/api/recurso',recursoRoutes);
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }

}

const server = new Server();
server.start();