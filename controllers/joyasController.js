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

    const stockTotalResult = await dbInstance.query(`
      SELECT SUM(stock) AS total FROM inventario
      WHERE id IN (${response.rows.map(joya => joya.id).join(',')})
    `);

    const stockTotal = parseInt(stockTotalResult.rows[0].total, 10) || 0;

    if (isNaN(stockTotal)) {
      stockTotal = 0;
    }

    res.status(200).json({
      totalJoyas: response.rows.length,
      stockTotal: parseInt(stockTotal, ),
      results: response.rows.map((joya) => ({
        id: joya.id,
        nombre: joya.nombre,
        precio: joya.precio,
        stock: joya.stock,
      })),
    });
    dbInstance.release();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getJoyasFiltros = async (req, res) => {
  try {
    const precio_min = parseInt(req.query.precio_min, 10);
    const precio_max = parseInt(req.query.precio_max, 10);
    const categoria = req.query.categoria;
    const metal = req.query.metal;

    if (isNaN(precio_min) || isNaN(precio_max) || precio_min > precio_max) {
      return res.status(400).json({ error: 'Parámetros de precio inválidos' });
    }

    let query = 'SELECT * FROM inventario'
    const params = [];

    if (precio_min) {
      query += ' WHERE precio >= $1';
      params.push(precio_min);
    }

    if (precio_max) {
      query += ' AND precio <= $2';
      params.push(precio_max);
    }

    if (categoria) {
      query += ' AND categoria = $3';
      params.push(categoria);
    }

    if (metal) {
      query += ' AND metal = $4';
      params.push(metal);
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