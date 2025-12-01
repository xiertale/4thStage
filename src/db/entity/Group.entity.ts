import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Student } from './Student.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: '' })
  uuid?: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  // Обратная связь: одна группа имеет много студентов
  @OneToMany(() => Student, (student) => student.group)
  students?: Student[];
}