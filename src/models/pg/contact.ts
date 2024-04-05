import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Contact {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column({unique: true})
	value?: string;

	@CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	createdAt?: Date;

	@UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	updatedAt?: Date;
}
