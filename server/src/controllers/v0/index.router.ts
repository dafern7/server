import {Router, Request, Response} from 'express';
import {FeedRouter} from './feed/routes/feed.router'
import {DeviceRouter} from './devices/routes/device.router'
import {ServicesRouter} from './services/routes/services.router'


const router: Router = Router();

router.use('/feed', FeedRouter);
router.use('/devices', DeviceRouter);
router.use('/services', ServicesRouter);

// api/vo/
router.get('/', (req, res) => {
    res.send('api/v0');
}); 

export const IndexRouter: Router = router;
