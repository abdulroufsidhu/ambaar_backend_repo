import { Entity, Unique, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Branch, Permission, User } from "./";

@Entity()
@Unique("employee_unique_constraint",["branch", "user", "role"])
export class Employee {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@ManyToOne(() => Branch, (branch: Branch) => branch,)
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

	@CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	createdAt?: Date;

	@UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	updatedAt?: Date;
}