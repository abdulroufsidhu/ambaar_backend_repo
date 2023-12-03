import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Address } from "./";

@Entity()
export class Nationality {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	nationalId: string;

	@ManyToOne(() => Address, (address) => address, { eager: true })
	address: Address;

	@CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	createdAt: Date;

	@UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	updatedAt: Date;
}

