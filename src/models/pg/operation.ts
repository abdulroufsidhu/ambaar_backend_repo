import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Person, Employee, Inventory } from "./"

@Entity()
export class Operation {
    @PrimaryGeneratedColumn('uuid')
    id?: string

    @ManyToOne(()=>Employee, (employee)=>employee, {eager: true})
    employee?: Employee

    @ManyToOne(()=>Person, (person)=>person, {eager: true})
    customer?: Person

    @Column()
    action?: string

    @Column()
    quantiry?: number

    @Column()
    price?: number

    @ManyToOne(()=>Inventory, (inventory)=>inventory, {eager: true})
    item?: Inventory
    
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;
  
    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;

}
