import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  
  @Column()
  age: Number;

  @Column()
  dob: string;
}
