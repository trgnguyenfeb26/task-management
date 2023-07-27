import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
import { User } from './User';
import { Task } from './Task';

@Entity({ name: 'assigned' })
export class Assigned extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @ManyToOne(() => Task, (task) => task)
    @JoinColumn({ name: 'taskId' })
    task: Task;
    @Column()
    taskId: string;

    @ManyToOne(() => User, (user) => user)
    @JoinColumn({ name: 'userId' })
    user: User;
    @Column()
    userId: string;
    
    @CreateDateColumn()
    joinedAt: Date;
}
