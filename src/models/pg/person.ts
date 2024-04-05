import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";

import { Address, Contact } from "./";

@Entity()
export class Person {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column()
	name?: string;

	@OneToOne(() => Contact, (contact) => contact, {eager: true, nullable: false})
	@JoinColumn()
	contact?: Contact;

	@ManyToOne(() => Address, (address) => address, {eager: true, nullable: false})
	address?: Address;

	@CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	createdAt?: Date;

	@UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	updatedAt?: Date;
}
