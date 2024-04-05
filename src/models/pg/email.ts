import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from "typeorm";

@Entity()
export class Email {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column({unique: true})
	value?: string;

	@CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	createdAt?: Date;

	@UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	updatedAt?: Date;
}
