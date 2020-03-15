import {Model, Table, PrimaryKey, Column, CreatedAt, UpdatedAt, HasMany, ForeignKey} from 'sequelize-typescript';
import { DataFeed } from '../../feed/models/DataFeed';
import { Col } from 'sequelize/types/lib/utils';

@Table
export class Device extends Model<Device> {
    @Column({primaryKey: true, autoIncrement:true})
    public deviceId: number;

    @Column({unique: true})
    public deviceName!: string;

    @Column
    public passwordHash!: string;

    @Column
    @CreatedAt
    public createdAt: Date = new Date();

    @Column
    @UpdatedAt 
    public updatedAt: Date = new Date();

    @HasMany( () => DataFeed)
    data: DataFeed[];

    short() {
        return {
            deviceName: this.deviceName
        }
    }
}
