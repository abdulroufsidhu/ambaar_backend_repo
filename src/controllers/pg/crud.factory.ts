import { ObjectLiteral, Repository, EntityTarget } from "typeorm";
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
			const v = await this.read(value)
			Logger.w('pg_crud_factory create: ', e)
			return (v);
		}
	}

	async read(value: T) {
		try {
			let v = {...value}
			const relations: string[] = []
			for (const key of Object.keys(v)) {
				if (typeof v[key] === "object") {
					const r = v[key].constructor.name.toLowerCase()
					const id = v[key]['id']
					v[key] = {id: id}
					relations.push(r) // don't use key because key can be different from object type
				}
			}
			delete v["password"]
			const toFind = {
				where: v,
				relations: relations
			}
			return this.repository.find(toFind);
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
