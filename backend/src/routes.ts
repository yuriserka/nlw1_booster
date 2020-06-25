import { Router } from 'express';
import points from './controllers/points.ctrl';
import items from './controllers/items.ctrl';

const router = Router();

router.get('/items', items.index);

router.post('/points', points.create);
router.get('/points', points.index);
router.get('/points/:id', points.show);

export default router;
