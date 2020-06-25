import { Request, Response } from "express";
import knex from '../database/connection';

class PointsController {
  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;

    let query = knex('collection_points');

    if (items) {
      query
        .join('point_items', 'collection_points.id', '=', 'point_items.point_id')
        .whereIn('point_items.item_id', String(items).split(',').map(i => Number(i.trim())))
    } else {
      query.select('*');
    }
    if (city) {
      query.where('city', String(city))
    }
    if (uf) {
      query.where('uf', String(uf).toUpperCase())
    }

    const points = await query
      .distinct()
      .select('collection_points.*');

    return res.json(points);
  }

  async create(req: Request, res: Response) {
    const { items, ...pointData } = req.body;
    const trx = await knex.transaction();

    const [point_id, _] = await trx('collection_points').insert({
      image: 'https://images.unsplash.com/photo-1562916743-2d870ff3c120?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60',
      ...pointData
    });

    await trx('point_items').insert(
      items.map((item_id: number) => {
        return {
          item_id,
          point_id
        };
      }),
    );

    trx.commit();
    return res.status(201).json({ point_id, ...pointData });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    const point = await knex('collection_points').where('id', id).first();

    if (!point) {
      return res.status(404).json({
        message: 'Point not found'
      });
    }

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.name', 'items.image');

    return res.json({
      point: {
        ...point,
        items
      }
    });
  }
}

export default new PointsController();
