# Developer Documentation: Operation Model
## Table of Contents
1. [Introduction](#introduction)
1. [Prerequisites](#prerequisites)
1. [Installation](#installation)
1. [Model Overview](#model-overview)
1. [Usage](#usage)
    - [Creating a New Operation](#creating-a-new-operation)
1. [Schema Details](#schema-details)
    - [Fields](#fields)
    - [References](#references)
    - [Validation](#validation)
1. [Contributing](#contributing)
1. [License](#license)
## Introduction
This document provides developer documentation for the Operation model, a MongoDB schema created with Mongoose. The model represents operations involving inventory items, employees, and persons. It includes details such as the type of action (sale or purchase), quantity, and price.

## Prerequisites
- Node.js and npm installed
- MongoDB installed and running
- Understanding of TypeScript and Mongoose
- Dependencies: [IBranch](./branch.md), [IInventory](./inventory.md), [IPerson](./person.md), and [IEmployee](./employee.md) models
## Installation
1. Install the required dependencies:

```bash
npm install mongoose
```
2. Import the necessary modules in your code:

```typescript
import mongoose from 'mongoose';
import Operation, { IOperationModel } from './path-to-operation-model';
```
3. Connect to your MongoDB database:

```typescript
mongoose.connect('mongodb://localhost:27017/your-database', { useNewUrlParser: true, useUnifiedTopology: true });
```
## Model Overview
The Operation model represents operations involving inventory items, employees, and persons. It captures details such as the type of action (sale or purchase), quantity, and price.

## Usage
### Creating a New Operation
```typescript
const sampleOperation: IOperationModel = {
  inventory: '...inventoryId', // Replace with the actual inventory ID
  employee: '...employeeId', // Replace with the actual employee ID
  person: '...personId', // Replace with the actual person ID
  action: 'sale',
  quantity: 10,
  price: 100,
};

const newOperation = new Operation(sampleOperation);

newOperation.save()
  .then((savedOperation) => {
    console.log('Operation saved:', savedOperation);
  })
  .catch((error) => {
    console.error('Error saving operation:', error);
  });
```
## Schema Details
### Fields
- **`inventory`**: Reference to an inventory item (required).
- **`employee`**: Reference to an employee (required).
- **`person`**: Reference to a person (required).
- **`action`**: Type of action, either "sale" or "purchase" (required).
- **`quantity`**: Quantity of items involved in the operation (required).
- **`price`**: Price associated with the operation (required).
### References
- **`inventory`**: References the Inventory model.
- **`employee`**: References the Employee model.
- **`person`**: References the Person model.
### Validation
- **`action`**: Required and should be one of ["sale", "purchase"].
- **`quantity`**: Required and should be a number.
- **`price`**: Required and should be a number.
## Contributing
Contributions are welcome! Feel free to open issues, submit pull requests, or provide feedback.

## License
This project is licensed under the MIT License.