// path: controllers/joyasController.js

import { pool } from '../db/pool.js';

// debe poder recibir limit, page, order_by a traves de req.query
// ej: http://localhost:3001/joyas?limits=3&page=2&order_by=stock_ASC
export const getJoyas = async (req, res) => {
  try {
    const dbInstance = await pool.connect();
    const { limits, page, order_by } = req.query;

    let query = 'SELECT * FROM inventario';
    let params = [];

    const response = await dbInstance.query(query, params);
    res.status(200).json(response.rows);

    dbInstance.release();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getJoyasFiltros = async (req, res) => {
};