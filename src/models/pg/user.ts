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

import * as crypto from 'crypto';

import { Person, Employee, Email, Nationality } from "./";
import bcrypt from "bcryptjs";
import { config } from "../../config/config";

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
