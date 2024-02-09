import {
	Email,
	State,
	Country,
	City,
	Address,
	Nationality,
	Contact,
	Person,
	Branch,
	Business,
	User,
	Employee,
	Inventory,
	Operation,
	Permission,
	Product,
} from "../models/pg";
import { CRUD_Factory } from "./pg_crud_factory";

export class CountryCRUD extends CRUD_Factory<Country> {
	constructor() {
		super(Country);
	}
}
export class StateCRUD extends CRUD_Factory<State> {
	constructor() {
		super(State);
	}
}
export class CityCRUD extends CRUD_Factory<City> {
	constructor() {
		super(City);
	}
}
export class AddressCRUD extends CRUD_Factory<Address> {
	constructor() {
		super(Address);
	}
}
export class NationalityCRUD extends CRUD_Factory<Nationality> {
	constructor() {
		super(Nationality);
	}
}
export class ContactCRUD extends CRUD_Factory<Contact> {
	constructor() {
		super(Contact);
	}
}
export class EmailCRUD extends CRUD_Factory<Email> {
	constructor() {
		super(Email);
	}
}
export class PersonCRUD extends CRUD_Factory<Person> {
	constructor() {
		super(Person);
	}
}
export class UserCRUD extends CRUD_Factory<User> {
	constructor() {
		super(User);
	}
}
export class BranchCRUD extends CRUD_Factory<Branch> {
	constructor() {
		super(Branch);
	}
}
export class BusinessCRUD extends CRUD_Factory<Business> {
	constructor() {
		super(Business);
	}
}
export class EmployeeCRUD extends CRUD_Factory<Employee> {
	constructor() {
		super(Employee);
	}
}
export class InventoryCRUD extends CRUD_Factory<Inventory> {
	constructor() {
		super(Inventory);
	}
}
export class OperationCRUD extends CRUD_Factory<Operation> {
	constructor() {
		super(Operation);
	}
}
export class PermissionCRUD extends CRUD_Factory<Permission> {
	constructor() {
		super(Permission);
	}
}
export class ProductCRUD extends CRUD_Factory<Product> {
	constructor() {
		super(Product);
	}
}
