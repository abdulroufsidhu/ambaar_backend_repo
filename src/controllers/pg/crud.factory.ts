import {
	ObjectLiteral,
	Repository,
	EntityTarget,
	FindManyOptions,
	UpdateResult,
	DeleteResult,
	EntityManager,
} from "typeorm";
import { AppDataSource } from "../../data_source";

export class CRUD_Factory<T extends ObjectLiteral | Record<string, any>> {
	protected repository: Repository<T>;
	private targetEntity: EntityTarget<T>;

	constructor(value: EntityTarget<T>) {
		this.repository = AppDataSource.getRepository(value);
		this.targetEntity = value;
	}

	async create(value: T, entityManager?: EntityManager) {
		const v = await this.repository.create(value)
		if (entityManager) {
			return (await entityManager.insert(this.targetEntity, v)).generatedMaps as T[]
		}
		return (await this.repository.insert(v)).generatedMaps as T[]
	}

	async read(options: FindManyOptions<T>, entityManager?: EntityManager) {
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
		if (entityManager) {
			return entityManager.find(this.targetEntity, options);
		}
		return this.repository.find(options);
	}

	async update(value: T, entityManager?: EntityManager) {
		if (entityManager) {
			return entityManager.update(this.targetEntity, value["id"], value);
		}
		return this.repository.update(value["id"], value);
	}

	async delete(value: T, entityManager?: EntityManager) {
		if (entityManager) {
			return entityManager.delete(this.targetEntity, value["id"]);
		}
		return this.repository.delete(value["id"]);
	}
}

export abstract class DataToCrudWrapper<
	Type extends Record<string, any> | ObjectLiteral
> {
	abstract create(value: Type, entityManager?: EntityManager): Promise<Type>;
	async read(
		value: Type,
		crud: CRUD_Factory<Type>,
		relations?: string[],
		select?: string[]
	): Promise<Type> {
		const v = (await crud.read({ where: value, relations, select }))?.at(0);
		if (!!!v) throw `unable to read ${value} from ${crud}`;
		return v;
	}
	async readAll(
		value: Type,
		crud: CRUD_Factory<Type>,
		relations?: string[],
		select?: string[],
		entityManager?: EntityManager
	): Promise<Type[]> {
		const v = await crud.read({ where: value, relations, select }, entityManager);
		if (!!!v) throw `unable to read ${value} from ${crud}`;
		return v;
	}
	async update(value: Type, crud: CRUD_Factory<Type>, entityManager?: EntityManager): Promise<UpdateResult> {
		const v = await crud.update(value, entityManager);
		if (!!!v) throw "unable to update " + value;
		return v;
	}
	async delete(value: Type, crud: CRUD_Factory<Type>, entityManager?: EntityManager): Promise<DeleteResult> {
		const v = await crud.delete(value, entityManager);
		if (!!!v) throw `unable to delete where ${value}`;
		return v;
	}
}
