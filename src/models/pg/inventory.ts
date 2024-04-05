import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinTable, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Product, Branch } from "./";

@Entity()
export class Inventory {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@ManyToOne(() => Product, (product) => product,)
	product?: Product;

	@ManyToOne(() => Branch, (branch) => branch,)
	@JoinTable()
	branch?: Branch;

    @Column()
    unitBuyPrice?: number

    @Column()
    unitSellPrice?: number

    @Column()
    unitAllowedDiscount?: number

    @Column()
    availableQuantity?: number
    
    @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;
  
    @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt?: Date;

}
