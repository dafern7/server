import { Router, Response, Request} from 'express';
import { DataFeed } from "../models/DataFeed";
import {requireAuth} from '../../devices/routes/auth.router';
import * as AWS from '../../../../aws'
import {BatteryData} from '../../../../types'
import { Resolver } from 'dns';
import { Device } from '../../devices/models/Device';
const router: Router = Router();

const postData = async (req: Request, res: Response) => {
    const params: BatteryData = {
        deviceId: req.body.deviceId,
        powerIn: req.body.powerIn,
        powerOut: req.body.powerOut,
        voltage: req.body.voltage,
        current: req.body.current,
        marketPrice: req.body.marketPrice,
        SOC: req.body.SOC
    };

    // check of data is valid
    if(!params.deviceId) {
        return res.status(400).send({ message: 'deviceId is required' });
    }
    if(!params.powerIn) {
        return res.status(400).send({ message: 'powerIn is required' });
    }
    if(!params.powerOut) {
        return res.status(400).send({ message: 'powerOut is required' });
    }
    if(!params.voltage) {
        return res.status(400).send({ message: 'voltage is required' });
    }
    if(!params.SOC) {
        return res.status(400).send({ message: 'SOC is required' });
    }

    // check if deviceId is registered:
    const deviceId = req.body.deviceId;
    await Device.count({ where: {deviceId : deviceId} })
        .then(count => {
            if (count==0) {
                return res.status(400).send({auth: false, message: 'deviceName does not exist'});
            }
    });

    const item = await new DataFeed(params);
    const saved_item = await item.save();

    res.status(201).send(saved_item);
};

router.get('/', (req, res) => {
    res.send('hello');
}); 

// /api/v0/feed
router.post('/', requireAuth, (req, res) => {
    postData(req, res);
});
    

export const FeedRouter: Router = router;