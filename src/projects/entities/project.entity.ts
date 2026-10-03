import { Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import type { Relation } from 'typeorm';
import { Task } from "../../tasks/entities/task.entity.js";
@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 100 })
  name: string;
  @Column({ type: 'text', nullable: true })
  description: string | null;
  @OneToMany(() => Task, (task) => task.project)
  tasks: Relation<Task[]>;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
