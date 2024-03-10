import {
	ObjectLiteral,
	Repository,
	EntityTarget,
	FindManyOptions,
} from "typeorm";
import { AppDataSource } from "../../data_source";
import { Logger } from "../../libraries/logger";

export class CRUD_Factory<T extends ObjectLiteral | Record<string, any>> {
	protected repository: Repository<T>;

	constructor(value: EntityTarget<T>) {
		this.repository = AppDataSource.getRepository(value);
	}

	async create(value: T) {
		try {
			const v = this.repository.create(value);
			const r = await this.repository.insert(v);
			return r.generatedMaps;
		} catch (e) {
			const v = await this.read({ where: value });
			Logger.w("pg_crud_factory create: ", e);
			return v;
		}
	}

	async read(options: FindManyOptions<T>) {
		try {
			const v: Record<string, any> = options.where ?? {};
			const relations: string[] = [];
			for (const key of Object.keys(v)) {
				if (typeof v[key] === "object" && !options.relations) {
					const r = v[key].constructor.name.toLowerCase();
					const id = v[key]["id"];
					v[`${r}.id`] = id;
					delete v[key];
					relations.push(r);
				}
			}
			if (!options.relations) options.relations = relations;
			return this.repository.find(options);
		} catch (e) {
			Logger.w("pg_crud_factory read:", e);
			return null;
		}
	}

	async update(value: T) {
		try {
			return this.repository.update(value["id"], value);
		} catch (error) {
			Logger.w("pg_crud_factory update: ", error);
			return null;
		}
	}

	async delete(value: T) {
		try {
			return this.repository.delete(value["id"]);
		} catch (error) {
			Logger.w("pg_crud_factory delete: ", error);
			return null;
		}
	}
}
