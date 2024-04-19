import { Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Country {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column({ unique: true })
	name?: string;

	@CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	createdAt?: Date;

	@UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	updatedAt?: Date;
}

@Entity()
@Unique("states_unique_constraints",["name", "country"])
export class State {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column()
	name?: string;

	@ManyToOne(() => Country, (country) => country,{nullable: false, eager: true})
	country?: Country;

	@CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	createdAt?: Date;

	@UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	updatedAt?: Date;
}

@Entity()
@Unique("city_unique_constraint",["name", "state"])
export class City {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column()
	name?: string;

	@ManyToOne(() => State, (state) => state,{nullable: false, eager: true})
	state?: State;

	@CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	createdAt?: Date;

	@UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	updatedAt?: Date;
}

@Entity()
@Unique("address_unique_constraint",["name", "city"])
export class Address {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column({nullable: false})
	name?: string;

	@ManyToOne(() => City, (city) => city,{nullable: false})
	city?: City;

	@CreateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	createdAt?: Date;

	@UpdateDateColumn({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
	updatedAt?: Date;
}
