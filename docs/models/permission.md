# Developer Documentation: Permission Model
## Table of Contents
1. [Introduction](#introduction)
1. [Prerequisites](#prerequisites)
1. [Installation](#installation)
1. [Model Overview](#model-overview)
1. [Usage](#usage)
    - [Creating a New Permission](#creating-a-new-permission)
1. [Schema Details](#schema-details)
    - [Fields](#fields)
    - [Validation](#validation)
1. [Contributing](#contributing)
1. [License](#license)
## Introduction
This document provides developer documentation for the Permission model, a MongoDB schema created with Mongoose. The model represents permissions and includes a single field for the permission name.

## Prerequisites
- Node.js and npm installed
- MongoDB installed and running
- Understanding of TypeScript and Mongoose
## Installation
1. Install the required dependencies:

```bash
npm install mongoose
```
2. Import the necessary modules in your code:

```typescript
import mongoose from 'mongoose';
import Permission, { IPermissionModel } from './path-to-permission-model';
```
3. Connect to your MongoDB database:

```typescript
mongoose.connect('mongodb://localhost:27017/your-database', { useNewUrlParser: true, useUnifiedTopology: true });
```
## Model Overview
The Permission model represents permissions and includes a single field for the permission name. It enforces uniqueness for the permission name.

## Usage
### Creating a New Permission
```typescript
const samplePermission: IPermissionModel = {
  name: 'read_only',
};

const newPermission = new Permission(samplePermission);

newPermission.save()
  .then((savedPermission) => {
    console.log('Permission saved:', savedPermission);
  })
  .catch((error) => {
    console.error('Error saving permission:', error);
  });
```
## Schema Details
### Fields
- **`name`**: Name of the permission (required, unique, and trimmed).
### Validation
- **`name`**: Required, unique, and trimmed.
## Contributing
Contributions are welcome! Feel free to open issues, submit pull requests, or provide feedback.

## License
This project is licensed under the MIT License.

