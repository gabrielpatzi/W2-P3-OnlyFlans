import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { sequelize, connectDb } from './config/db.config.js';
import './models/index.js'; // modelos con las relaciones establecidas

import authRouter from './routes/auth.route.js';
import creatorRouter from './routes/creator.route.js';
import followerRouter from './routes/follower.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true, // esto para permitir el paso de la cookie que viene desde otro dominio 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser()); //este middleware es para poder parsear la cookie que nos envie el cliente de vuelta
app.use(express.json());

// Servir archivos subidos (fotos de perfil, banners, imagenes de posts)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/auth', authRouter);
app.use('/creators', creatorRouter);
app.use('/followers', followerRouter);

// Health check ... okey esto como pa que ?
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

async function start() {
    try {
        await connectDb();
        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados correctamente');

        app.listen(process.env.APP_PORT, () => {
            console.log(`Server running on port: ${process.env.APP_PORT}`);
        });
    } catch (error) {
        console.error(`Error al iniciar el servidor: ${error.message}`);
    }
}

start();
