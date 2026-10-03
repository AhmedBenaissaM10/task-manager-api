import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

type Status = 'pending' | 'in_progress' | 'completed';
@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  status: Status;
  @Column()
  dueDate: Date;
  @Column()
  projectId: string;
}
