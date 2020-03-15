import {Router, Request, Response} from 'express';
import fetch from 'node-fetch';
import {Device} from '../../devices/models/Device';
import {DataFeed} from '../../feed/models/DataFeed';

const router: Router = Router();

const url = 'http://optimizer_api:5000/api/v0/task';
const options = {
    headers: {
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    }
  };

router.get('/', async(req: Request, res: Response) => {

    await fetch(url, options)
        .then((response) => {
            response.json()
                .then((json) => {
                    res.send(json).status(200)
                })
                .catch((err: Error) => {
                    res.sendStatus(403);
                    
                })
        })
})

// The function queries data in the DataFeed DB by deviceId 
const getData = async (deviceId: number) => {
    let itemsArray
    await DataFeed.findAll({
        where: {deviceId: [deviceId]}
    }).then( items => itemsArray = items.map(vals => vals.powerIn));
    return itemsArray
}

router.post('/', async(req: Request, res: Response) => {
    const data = await getData( req.body.deviceId || 2);
    const body = { data: data }; 
    await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'},
    })
    .then(response => response.json()) // expecting a json response
    .then(json => {
        res.send(json)
    })
})

export const ServicesRouter: Router = router;