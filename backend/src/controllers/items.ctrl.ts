import { Request, Response } from "express";
import knex from '../database/connection';

class ItemsController {
  async index(req: Request, res: Response) {
    const items = await knex('items').select('*');
    return res.json(
      items.map(i => {
        return {
          id: i.id,
          name: i.name,
          image_url: `${req.protocol}://${req.get('host')}/uploads/${i.image}`,
        };
      }),
    );
  }
}

export default new ItemsController();
