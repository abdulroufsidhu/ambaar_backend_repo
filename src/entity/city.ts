import { Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { State } from "./";

@Entity()
@Unique(["name", "state"])
export class City {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column()
	name?: string;

	@ManyToOne(() => State, (state) => state, { eager: true })
	state?: State;

	@CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	createdAt?: Date;

	@UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	updatedAt?: Date;
}
