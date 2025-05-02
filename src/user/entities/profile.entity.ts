import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: Number;

  @Column()
  dob: string;
}
