import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { Person, Inventory, User } from "./"

@Entity()
export class Operation {
    @PrimaryGeneratedColumn('uuid')
    id?: string

    @ManyToOne(()=>User, (user)=>user, {eager: true})
    user?: User

    @ManyToOne(()=>Person, (person)=>person, {eager: true})
    customer?: Person

    // 0 means read
    // 1 means create
    // 2 means update
    // 3 means delete
    @Column()
    action?: 0|1|2|3 

    @Column()
    url?: string

    @Column()
    quantity?: number

    @Column()
    price?: number

    @ManyToOne(()=>Inventory, (inventory)=>inventory, {eager: true})
    item?: Inventory
    
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;
  
    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;

}
