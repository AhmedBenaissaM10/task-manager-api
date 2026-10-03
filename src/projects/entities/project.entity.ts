import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    description: string;
}
