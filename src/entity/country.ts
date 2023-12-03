import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Country {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ unique: true })
	name: string;

	@CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	createdAt: Date;

	@UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	updatedAt: Date;
}
