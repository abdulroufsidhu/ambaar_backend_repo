import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany, JoinTable, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import { Person, Employee, Email, Nationality } from "./";
import bcrypt from "bcryptjs"


@Entity()
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	username: string;

	@OneToOne(() => Email, (email) => email, { eager: true })
	@JoinColumn()
	email: Email;

	@OneToOne(() => Person, (person) => person, { eager: true })
	@JoinColumn()
	person: Person;

	@OneToOne(() => Nationality, (nationality) => nationality, { eager: true })
	@JoinColumn()
	nationality: Nationality;

	@Column({ select: false })
	password: string;

	@Column()
	token: string;

	@OneToMany(() => Employee, (employee) => employee, { eager: true })
	@JoinTable()
	employees: Employee[];

	@CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	createdAt: Date;

	@UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	updatedAt: Date;

	@BeforeInsert()
	@BeforeUpdate()
	async hashPassword() {
		if (this.password) {
			const salt = await bcrypt.genSalt(10);
			this.password = await bcrypt.hash(this.password, salt);
		}
	}

	comparePassword = async (candidatePassword: string) =>
		bcrypt.compare(candidatePassword, this.password);
}
