import { Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Person } from "./";

@Entity()
@Unique(["name", "licence"])
export class Business {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column()
	name?: string;

	@Column()
	licence?: string;

	@ManyToOne(() => Person, (person) => person,)
	person?: Person;

	@CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	createdAt?: Date;

	@UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	updatedAt?: Date;
}
