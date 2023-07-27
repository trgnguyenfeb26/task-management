import { Entity, Column } from 'typeorm';
import BaseModel from './BaseModel';

@Entity({ name: 'users' })
export class User extends BaseModel {
  @Column({ type: 'varchar', length: 20 })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;
}
