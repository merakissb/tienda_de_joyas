// path: controllers/joyasController.js

import { pool } from '../db/pool.js';

export const getJoyas = async (req, res) => {
  try {

    const limits = parseInt(req.query.limits, 10);
    const page = parseInt(req.query.page, 10);
    const order_by = req.query.order_by;

    if (limits < 0 || page < 1) {
      return res.status(400).json({ error: 'invalid params' });
    }

    let query = 'SELECT * FROM inventario';
    const params = [];

    if (limits) {
      query += ' LIMIT $1';
      params.push(limits);
    }

    if (page) {
      query += ' OFFSET $2';
      params.push((page - 1) * limits);
    }

    if (order_by) {
      const order = order_by.split('_');
      query += ' ORDER BY $3 $4';
      params.push(order[0], order[1]);
    }

    const dbInstance = await pool.connect();
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