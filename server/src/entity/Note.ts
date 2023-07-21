import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Task } from './Task';
import { User } from './User';

@Entity({ name: 'notes' })
export class Note extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'authorId' })
  author: User;
  @Column()
  authorId: string;

  @ManyToOne(() => Task, (task) => task)
  @JoinColumn({ name: 'taskId' })
  task: Task;
  @Column()
  taskId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
