import { Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { Person } from "./";
import { Address, Contact, Email } from "./";

@Entity()
@Unique("business_unique_constraint",["name", "licence"])
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

/**
 * @param id string [Optional]
 * @param name string [Optional]
 * @param code string [Optional]
 * @param email Email [Optional]
 * @param contact Contact [Optional]
 * @param business Business [Optional]
 * @param address Address [Optional]
 * @param createdAt Date [Optional]
 * @param updatedAt Date [Optional]
 */
@Entity()
@Unique("branch_unique_constraint",["name", "code", "business"])
export class Branch {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column()
	name?: string;

	@Column()
	code?: string;

	@OneToOne(() => Email, (email: Email) => email,)
	@JoinColumn()
	email?: Email;

	@OneToOne(() => Contact, (contact) => contact,)
	@JoinColumn()
	contact?: Contact;

	@ManyToOne(() => Business, (business) => business,)
	business?: Business;

	@ManyToOne(() => Address, (address) => address,)
	address?: Address;

	@CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	createdAt?: Date;

	@UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	updatedAt?: Date;
}