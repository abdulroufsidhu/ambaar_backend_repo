import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, Column, CreateDateColumn, UpdateDateColumn, Unique } from "typeorm";

import {Branch, Permission, User} from "./"



@Entity()
@Unique(["branch", "user", "role"])
export class Employee {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@ManyToOne(() => Branch, (branch) => branch,)
	branch?: Branch;

	@ManyToMany(() => Permission, (permission) => permission,)
	@JoinTable()
	permissions?: Permission[];

	@ManyToOne(() => User, (user) => user.employees)
	user?: User;

	@Column()
	isActive?: Boolean;

	@Column()
	role?: string;

	@CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	createdAt?: Date;

	@UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
	updatedAt?: Date;
}
