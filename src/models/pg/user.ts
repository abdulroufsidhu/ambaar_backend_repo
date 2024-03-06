import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToOne,
	JoinColumn,
	OneToMany,
	JoinTable,
	CreateDateColumn,
	UpdateDateColumn,
	BeforeInsert,
	BeforeUpdate,
} from "typeorm";
import { Person, Employee, Email, Nationality } from "./";
import bcrypt from "bcryptjs";

@Entity({ name: "ambaar_users" })
export class User {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column()
	username?: string;

	@OneToOne(() => Email, (email) => email)
	@JoinColumn()
	email?: Email;

	@OneToOne(() => Person, (person) => person)
	@JoinColumn()
	person?: Person;

	@OneToOne(() => Nationality, (nationality) => nationality)
	@JoinColumn()
	nationality?: Nationality;

	@Column({ select: false })
	password?: string;

	@Column({ default: null })
	token?: string;

	@OneToMany(() => Employee, (employee) => employee)
	@JoinTable()
	employees?: Employee[];

	@CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	createdAt?: Date;

	@UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	updatedAt?: Date;

	@BeforeInsert()
	@BeforeUpdate()
	async hashPassword?() {
		if (this.password) {
			const salt = await bcrypt.genSalt(10);
			this.password = await bcrypt.hash(this.password, salt);
		}
	}

	static comparePassword = async (candidatePassword: string, password?: string) =>
		bcrypt.compare(candidatePassword, password || "");

	static hash = async (string: string) =>
		await bcrypt.hash(string, await bcrypt.genSalt(10));
}
