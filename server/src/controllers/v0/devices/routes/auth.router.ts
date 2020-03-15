import {Router, Request, Response} from 'express';

import { Device } from '../models/Device'

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {NextFunction} from 'connect'
import {config} from '../../../../config/config'
import JwtDecode = require('jwt-decode');
import { AuthToken } from '../../../../types';
import { type } from 'os';

const router: Router = Router();

// use bcrypt to generate salted hash 
async function generatePassword(plainTextPassword: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(plainTextPassword, salt);
    return hash
}

// Use bcrypt to compare password to salted hashed pass
async function comparePasswords(plainTextPassword: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hash);
}

function generateJWT(user: Device): string {
    return jwt.sign(user.toJSON(), config.dev.jwt_secret)
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.headers || !req.headers.authorization){
        return res.status(401).send({ message: 'No authorization headers.' });
    }
    
    const token_bearer = req.headers.authorization.split(' ');
    if(token_bearer.length != 2){
        return res.status(401).send({ message: 'Malformed token.' });
        
    }

    const token = token_bearer[1];
    
    return jwt.verify(token, config.dev.jwt_secret, (err, decoded) => {
      if (err) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate.' });
      }
      const decodedToken: AuthToken = JwtDecode(token);
      const deviceName = decodedToken.deviceName;
      const deviceId = decodedToken.deviceId;
      req.body.deviceName = deviceName;
      req.body.deviceId = deviceId;
      return next();
    });
}

router.get('/verification', requireAuth, async(req: Request, res: Response) => {
    return res.status(200).send({auth: true, message: 'Authenticated'});
});

router.post('/login', async (req: Request, res: Response) => {
    const deviceName = req.body.deviceName;
    const password = req.body.password;

    if (!deviceName){
        return res.status(400).send({auth: false, message: 'deviceName is required'})
    }

    if (!password) {
        return res.status(400).send({auth: false, message: 'Password is required'})
    }

    let deviceId; 
    await Device.findAll({
        attributes: ['deviceId', 'deviceName', 'passwordHash', 'createdAt', 'updatedAt'],
        where: {
            deviceName: deviceName
        }
    }).then( arr => {
        if(!arr.length) {
            return res.status(401).send({auth: false, message: 'device not found, check if the deviceName is correct or register'})
        }
        else {
            deviceId = arr[0].dataValues.deviceId; 
        }
    });

    if(deviceId){
        const device = await Device.findByPk(deviceId);
        const authValid = await comparePasswords(password, device.passwordHash)
        if (!authValid) {
            res.status(401).send({auth: false, message: 'wrong password'})
        }
        else{
            // Generate JWT
            const jwt = generateJWT(device);
            res.status(200).send({ auth: true, token: jwt, device: device.short()});
        }
    }

});

// register a new user
router.post('/', async(req: Request, res: Response) => {
    const deviceName = req.body.deviceName;
    const plainTextPassword = req.body.password;
    // check if deviceName is valid
    if (!deviceName || (deviceName.length <=4) ) {
        return res.status(400).send({auth: false, message: 'deviceName is required or too short'})
    }

    // check if password is valid
    if(!plainTextPassword) {
        res.status(400).send({auth: false, message: 'password is required'})
    }

    const passwordHash = await generatePassword(plainTextPassword);
    
    // check if device name exist. If not generate new user
    await Device.count({ where: {deviceName : deviceName} })
    .then( async(count) => {
        if (count!=0) {
            return res.status(400).send({auth: false, message: 'deviceName already exists'}); 
        }
        else{
            const newDevice = await new Device({
                deviceName: deviceName,
                passwordHash: passwordHash
            });

            let savedDevice;
            try {
                savedDevice = await newDevice.save();
            } catch(e) {
                throw e;
            }
                //generate JWT
            const jwt = generateJWT(savedDevice)
            res.status(201).send({token: jwt, user: savedDevice.short()});
        }
    });
})

router.get('/', async (req: Request, res: Response) => {
    res.send('auth')
});

export const AuthRouter: Router = router;