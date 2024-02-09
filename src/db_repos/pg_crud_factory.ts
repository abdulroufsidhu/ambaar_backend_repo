import { ObjectLiteral, Repository, EntityTarget } from "typeorm";
import { AppDataSource } from "../data-source";
import { Logger } from "../libraries/logger";

export class CRUD_Factory <T extends ObjectLiteral> {
	protected repository: Repository<T>

	constructor (value: EntityTarget<T>) {
		this.repository = AppDataSource.getRepository(value)
	}

	async create(value: T) {
		try {
			return this.repository.create(value);
		} catch (error) {
            Logger.w('pg_crud_factory', error)
			return this.read(value);
		}
	}

	async read(value: T) {
		try {
			return this.repository.find({ where: value });
		} catch (e) {
			Logger.w("pg_address_controller", e);
			return null;
		}
	}

	async update(value: T) {
		try {
			return this.repository.update(value["id"], value);
		} catch (error) {
            Logger.w('pg_crud_factory', error)
			return null;
		}
	}

	async delete(value: T) {
		try {
			return this.repository.delete(value["id"]);
		} catch (error) {
            Logger.w('pg_crud_factory', error)
			return null;
		}
	}
}