import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

/**
 * @param id string [Optional]
 * @param value string [Optional]
 * @param createdAt Date [Optional]
 * @param updatedAt Date [Optional]
 */
@Entity()
export class Email {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column({unique: true})
	value?: string;

	@CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	createdAt?: Date;

	@UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	updatedAt?: Date;
}

/**
 * @param id string [Optional]
 * @param value string [Optional]
 * @param createdAt Date [Optional]
 * @param updatedAt Date [Optional]
 */
@Entity()
export class Contact {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column({unique: true})
	value?: string;

	@CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	createdAt?: Date;

	@UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	updatedAt?: Date;
}
