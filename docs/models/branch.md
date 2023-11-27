# Developer Documentation: Branch Model
## Table of Contents
1. [Introduction](#introduction)
1. [Prerequisites](#prerequisites)
1. [Installation](#installation)
1. [Model Overview](#model-overview)
1. [Usage](#usage)
    - [Creating a New Branch](#creating-a-new-branch)
1. [Schema Details](#schema-details)
    - [Fields](#fields)
    - [References](#references)
    - [Validation](#validation)
1. [Contributing](#contributing)
1. [License](#license)
## Introduction
This document provides developer documentation for the Branch model, a MongoDB schema created with Mongoose. The model represents branches and includes details such as the branch name, contact information, email, location, and the associated business.

## Prerequisites
- Node.js and npm installed
- MongoDB installed and running
- Understanding of TypeScript and Mongoose
- Dependencies: [IBusiness](./business.md) model
## Installation
1. Install the required dependencies:

```bash
npm install mongoose mongoose-unique-validator
```
2. Import the necessary modules in your code:

```typescript
import mongoose from 'mongoose';
import Branch, { IBranchModel } from './path-to-branch-model';
```
3. Connect to your MongoDB database:

```typescript
mongoose.connect('mongodb://localhost:27017/your-database', { useNewUrlParser: true, useUnifiedTopology: true });
```
## Model Overview
The Branch model represents branches and includes details such as the branch name, contact information, email, location, and the associated business.

## Usage
### Creating a New Branch
```typescript
const sampleBranch: IBranchModel = {
  name: 'XYZ Branch',
  contact: '9876543210',
  email: 'xyzbranch@example.com',
  location: '123 Main Street, City',
  business: '...businessId', // Replace with the actual business ID
};

const newBranch = new Branch(sampleBranch);

newBranch.save()
  .then((savedBranch) => {
    console.log('Branch saved:', savedBranch);
  })
  .catch((error) => {
    console.error('Error saving branch:', error);
  });
```
## Schema Details
### Fields
- **`name`**: Name of the branch (required).
- **`contact`**: Contact information for the branch (required, unique).
- **`email`**: Email address for the branch (required, unique).
- **`location`**: Location of the branch (required).
- **`business`**: Reference to the associated business (required).
### References
- **`business`**: References the Business model.
### Validation
- **`name`**: Required and should be a string.
- **`contact`**: Required, unique, and should be a string.
- **`email`**: Required, unique, and should be a string.
- **`location`**: Required and should be a string.
## Contributing
Contributions are welcome! Feel free to open issues, submit pull requests, or provide feedback.

## License
This project is licensed under the MIT License.