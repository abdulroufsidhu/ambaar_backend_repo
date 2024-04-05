import {
	Entity,
	Unique,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";

@Entity()
@Unique(["name", "detail", "color", "variant"])
export class Product {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column()
	name?: string;

	@Column()
	detail?: string;

	@Column()
	color?: string;

	@Column()
	variant?: string;

	@CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	createdAt?: Date;

	@UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	updatedAt?: Date;
}
