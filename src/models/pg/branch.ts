import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn,
} from "typeorm";
import { Business, Address, Contact, Email } from "./";

@Entity()
@Unique(["name", "code", "business"])
export class Branch {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column()
	name?: string;

	@Column()
	code?: string;

	@OneToOne(() => Email, (email) => email,)
	@JoinColumn()
	email?: Email;

	@OneToOne(() => Contact, (contact) => contact,)
	@JoinColumn()
	contact?: Contact;

	@ManyToOne(() => Business, (business) => business,)
	business?: Business;

	@ManyToOne(() => Address, (address) => address,)
	address?: Address;

	@CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	createdAt?: Date;

	@UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	updatedAt?: Date;
}
