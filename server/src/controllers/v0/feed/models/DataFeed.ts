import {Table, Column, Model, CreatedAt, UpdatedAt, DataType, ForeignKey, BelongsTo, HasMany} from 'sequelize-typescript';
import { Device } from '../../devices/models/Device';


@Table
export class DataFeed extends Model<DataFeed> {
  @Column(DataType.FLOAT)
  public powerIn!: number;

  @Column(DataType.FLOAT)
  public powerOut!: number;
  
  @Column(DataType.FLOAT)
  public voltage!: number;

  @Column(DataType.FLOAT)
  public SOC!: number;

  @Column(DataType.FLOAT)
  public current: number;

  @Column(DataType.FLOAT)
  public marketPrice: number;

  @Column(DataType.FLOAT)
  public reactivePower: number;

  @Column
  @CreatedAt
  public createdAt: Date = new Date();

  @Column
  @UpdatedAt
  public updatedAt: Date = new Date();

  @ForeignKey(() => Device)
  @Column
  public deviceId: number;

  @BelongsTo(() => Device ,'deviceId')
  deviceCredentials: Device[];
}