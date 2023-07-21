import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import BaseModel from './BaseModel';
import { User } from './User';
import { Member } from './Member';
import { Task } from './Task';

@Entity({ name: 'projects' })
export class Project extends BaseModel {
  @Column({ type: 'varchar', length: 60 })
  name: string;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;
  @Column()
  createdById: string;

  @OneToMany(() => Member, (member) => member.project)
  @JoinColumn()
  members: Member[];

  @OneToMany(() => Task, (tasks) => tasks.project)
  @JoinColumn()
  tasks: Task[];
}
