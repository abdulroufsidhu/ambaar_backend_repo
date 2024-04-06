import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Permission {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	/**
	 * we could also use numbers which would made database operations much faster
	 * but the catch with this approach is that it is difficult to maintain.
	 * as a permission will be mapped to an integer value and managing strings w.r.t
	 * integers is a pain unless an algorithem is devices we shall go with the strings.
	 */
	@Column({ nullable: false, unique: true })
	name?: string;

	@CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	createdAt?: Date;

	@UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	updatedAt?: Date;
}
