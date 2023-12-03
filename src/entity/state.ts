import { Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Country } from "./";

@Entity()
@Unique(["name", "country"])
export class State {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	name: string;

	@ManyToOne(() => Country, (country) => country, { eager: true })
	country: Country;

	@CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	createdAt: Date;

	@UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	updatedAt: Date;
}
