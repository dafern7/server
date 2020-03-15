import {Router, Request, Response} from 'express';
import { Device} from '../models/Device'
import {AuthRouter, requireAuth} from './auth.router'

const router: Router = Router();
router.use('/auth', AuthRouter);
router.get('/', async(req: Request, res: Response) => {res.send('Devices')});

router.get('/:id', async(req: Request, res: Response) => {
    let { id } = req.params;
    const item = await Device.findByPk(id);
    res.send(item);
});

export const DeviceRouter: Router = router; 
