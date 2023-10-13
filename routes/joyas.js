// path: routes/joyas.js

import express from 'express';
import { getJoyas, getJoyasFiltros } from '../controllers/joyasController.js';

const router = express.Router();

// Definición de rutas
router.get('/', getJoyas);
router.get('/filtros', getJoyasFiltros);

export default router;