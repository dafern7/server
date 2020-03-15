import {Sequelize} from 'sequelize-typescript';
import {config} from './config/config';
import {Table, Column, Model, CreatedAt, UpdatedAt, DataType} from 'sequelize-typescript';

const c = config.dev;
// Instantiate new Sequelize instance!
const sequelize = new Sequelize({
    "username": c.username,
    "password": c.password,
    "database": c.database,
    "host":     c.host,
  
    dialect: 'postgres',
    storage: ':memory:',
  });

  sequelize.authenticate()
    .then( () => {
      console.log(`Connection to ${c.username} is successfull`)
    })
    .catch( err => {
      console.log('Unable to conect: ', err)
    });

export {sequelize};