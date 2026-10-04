import type { Relation } from 'typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from '../../tasks/entities/task.entity.js';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 50, unique: true })
  name: string;
  @ManyToMany(() => Task, (task) => task.tags)
  tasks: Relation<Task>[];

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
