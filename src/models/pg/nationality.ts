import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Address } from "./";

@Entity()
export class Nationality {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column({unique: true})
	nationalId?: string;

	@ManyToOne(() => Address, (address) => address,)
	address?: Address;

	@CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	createdAt?: Date;

	@UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	updatedAt?: Date;
}

