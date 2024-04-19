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
	ManyToOne,
} from "typeorm";

import * as crypto from 'crypto';

import { Email,Address, Contact, Employee } from "./";
import { config } from "../config/config";

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

	@CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	createdAt?: Date;

	@UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	updatedAt?: Date;
}

@Entity()
export class Nationality {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column({unique: true})
	nationalId?: string;

	@ManyToOne(() => Address, (address) => address,)
	address?: Address;

	@CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	createdAt?: Date;

	@UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	updatedAt?: Date;
}

@Entity({ name: "ambaar_users" })
export class User {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column()
	username?: string;

	@OneToOne(() => Email, (email: Email) => email)
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

	@Column({ select: false, default: null })
	token?: string;

	@OneToMany(() => Employee, (employee) => employee)
	@JoinTable()
	employees?: Employee[];

	@CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	createdAt?: Date;

	@UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	updatedAt?: Date;

	@BeforeInsert()
	@BeforeUpdate()
	async hashPassword?() {
		if (this.password) {
			this.password = User.encrypt(this.password)
		}
	}

	static comparePassword = async (incommingPassword: string, storedHash?: string) => {
		return incommingPassword === User.decrypt(storedHash ?? "")
	}

	static encrypt(text: string): string {
		const cipher = crypto.createCipheriv(config.Encryption.algorithm, config.Encryption.key, config.Encryption.iv);
		let encrypted = cipher.update(text, 'utf-8', 'hex');
		encrypted += cipher.final('hex');
		return encrypted;
	}
	
	static decrypt(encryptedText: string): string {
		const decipher = crypto.createDecipheriv(config.Encryption.algorithm, config.Encryption.key, config.Encryption.iv);
		let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
		decrypted += decipher.final('utf-8');
		return decrypted;
	}
}
