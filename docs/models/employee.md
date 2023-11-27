# Developer Documentation: Employee Model
## Table of Contents
1. [Introduction](#introduction)
1. [Prerequisites](#prerequisites)
1. [Installation](#installation)
1. [Model Overview](#model-overview)
1. [Usage](#usage)
    - [Creating a New Employee](#creating-a-new-employee)
1. [Schema Details](#schema-details)
    - [Fields](#fields)
    - [References](#references)
    - [Validation](#validation)
1. [Contributing](#contributing)
1. [License](#license)
## Introduction
This document provides developer documentation for the Employee model, a MongoDB schema created with Mongoose. The model represents employees and includes details such as the associated user, branch, role, permissions, and status.

## Prerequisites
- Node.js and npm installed
- MongoDB installed and running
- Understanding of TypeScript and Mongoose
- Dependencies: [IUser](./user.md) , [IBranch](./branch.md), and [IPermission](./permission.md) models
## Installation
1. Install the required dependencies:

```bash
npm install mongoose
```
2. Import the necessary modules in your code:

```typescript
import mongoose from 'mongoose';
import Employee, { IEmployeeModel } from './path-to-employee-model';
```
3. Connect to your MongoDB database:

```typescript
mongoose.connect('mongodb://localhost:27017/your-database', { useNewUrlParser: true, useUnifiedTopology: true });
```
## Model Overview
The Employee model represents employees and includes details such as the associated user, branch, role, permissions, and status.

## Usage
### Creating a New Employee
```typescript
const sampleEmployee: IEmployeeModel = {
  user: '...userId', // Replace with the actual user ID
  branch: '...branchId', // Replace with the actual branch ID
  role: 'manager',
  permissions: ['...permissionId1', '...permissionId2'], // Replace with the actual permission IDs
  status: 'active',
};

const newEmployee = new Employee(sampleEmployee);

newEmployee.save()
  .then((savedEmployee) => {
    console.log('Employee saved:', savedEmployee);
  })
  .catch((error) => {
    console.error('Error saving employee:', error);
  });
```
## Schema Details
### Fields
- **`user`**: Reference to a user (required).
- **`branch`**: Reference to a branch (required).
- **`role`**: Role of the employee (required).
- **`permissions`**: Array of permission references.
- **`status`**: Status of the employee, either "active" or "inactive" (required).
### References
- **`user`**: References the User model.
- **`branch`**: References the Branch model.
- **`permissions`**: References the Permission model.
### Validation
- **`role`**: Required and should be a string.
- **`permissions`**: Optional array of permission references.
- **`status`**: Required and should be one of ["active", "inactive"].
## Contributing
Contributions are welcome! Feel free to open issues, submit pull requests, or provide feedback.

## License
This project is licensed under the MIT License.