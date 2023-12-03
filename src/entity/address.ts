import { Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { City } from "./index";

@Entity()
@Unique(["name", "city"])
export class Address {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	name: string;

	@ManyToOne(() => City, (city) => city, { eager: true })
	city: City;

	@CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	createdAt: Date;

	@UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	updatedAt: Date;
}
