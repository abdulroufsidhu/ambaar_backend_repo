# Models
Models are the classes of typescript to typeguard teh data of several types whole system consists of following modal classes
 1) Person [Source](../../src/models/person.ts) - [Documentation](person.md) 
 2) User [Source](../../src/models/user.ts) - [Documentation](user.md)
 3) Branch [Source](../../src/models/branch.ts) - [Documentation](branch.md)
 4) Business [Source](../../src/models/business.ts) - [Documentation](business.md)
 5) Employee [Source](../../src/models/employee.ts) - [Documentation](employee.md)
 6) Inventory [Source](../../src/models/inventory.ts) - [Documentation](inventory.md)
 7) Operation [Source](../../src/models/operation.ts) - [Documentation](operation.md)
 8) Permission [Source](../../src/models/permission.ts) - [Documentation](permission.md)
 9) Product [Source](../../src/models/product.ts) - [Documentation](product.md)

```mermaid
---
title: ER Diagram of the system
---
erDiagram
    Person ||--o{ User : "Has"
    User ||--o{ Employee : "Is"
    Business ||--o{ Branch : "Has"
    Business ||--o{ Employee : "Has"
    Branch ||--o{ Inventory : "Has"
    Employee ||--o{ Operation : "Performs"
    User ||--o{ Operation : "Performs"
    Permission ||--o{ Employee : "Grants"
```

```mermaid
---
title: classDiagram of the system models
---
classDiagram
    class Person {
      _id: ObjectId
      name: String
      username: String
      contact: String
      nationalId: String
      email: String
    }

    class User {
      _id: ObjectId
      person: Person
      password: String
      token: String
      comparePassword(candidatePassword: String): Promise<boolean>
    }

    class Business {
      _id: ObjectId
      name: String
      contact: String
      email: String
      licence: String
      founder: Person
    }

    class Branch {
      _id: ObjectId
      name: String
      contact: String
      email: String
      location: String
      business: Business
    }

    class Inventory {
      _id: ObjectId
      product: Product
      branch: Branch
      serialNumber: String
      unitBuyPrice: Number
      unitSellPrice: Number
      unitDescountPrice: Number
      quantity: Number
    }

    class Employee {
      _id: ObjectId
      user: User
      branch: Branch
      role: String
      permissions: [Permission]
      status: String
    }

    class Operation {
      _id: ObjectId
      inventory: Inventory
      employee: Employee
      person: Person
      action: String
      quantity: Number
      price: Number
    }

    class Product {
      _id: ObjectId
      name: String
      detail: String
      colour: String
      variant: String
    }

    class Permission {
      _id: ObjectId
      name: String
    }

    Person <|-- User
    Person <|-- Business : Founder
    User --|> Employee
    Business --|> Branch
    Business --|> Employee
    Branch --|> Inventory
    Employee --|> Operation
    User --|> Operation
    Permission --|> Employee
    Inventory --|> Product
```


