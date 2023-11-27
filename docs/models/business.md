# Developer Documentation: Business Model
## Table of Contents
1. [Introduction](#introduction)
1. [Prerequisites](#prerequisites)
1. [Installation](#installation)
1. [Model Overview](#model-overview)
1. [Usage](#usage)
    - [Creating a New Business](#creating-a-new-business)
1. [Schema Details](#schema-details)
    - [Fields](#fields)
    - [References](#references)
    - [Validation](#validation)
1. [Contributing](#contributing)
1. [License](#license)
## Introduction
This document provides developer documentation for the Business model, a MongoDB schema created with Mongoose. The model represents businesses and includes details such as the business name, contact information, email, license, and the founder's reference.

## Prerequisites
- Node.js and npm installed
- MongoDB installed and running
- Understanding of TypeScript and Mongoose
- Dependencies: [IPerson](./person.md) model
## Installation
1. Install the required dependencies:

```bash
npm install mongoose mongoose-unique-validator
```
2. Import the necessary modules in your code:

```typescript
import mongoose from 'mongoose';
import Business, { IBusinessModel } from './path-to-business-model';
```
3. Connect to your MongoDB database:

```typescript
mongoose.connect('mongodb://localhost:27017/your-database', { useNewUrlParser: true, useUnifiedTopology: true });
```
## Model Overview
The Business model represents businesses and includes details such as the business name, contact information, email, license, and the founder's reference.

## Usage
### Creating a New Business
```typescript
const sampleBusiness: IBusinessModel = {
  name: 'ABC Corporation',
  contact: '1234567890',
  email: 'abc@example.com',
  licence: 'XYZ123',
  founder: '...founderId', // Replace with the actual founder's ID
};

const newBusiness = new Business(sampleBusiness);

newBusiness.save()
  .then((savedBusiness) => {
    console.log('Business saved:', savedBusiness);
  })
  .catch((error) => {
    console.error('Error saving business:', error);
  });
```
## Schema Details
### Fields
- **`name`**: Name of the business (required).
- **`contact`**: Contact information for the business (required).
- **`email`**: Email address for the business (required).
- **`licence`**: Business license information.
- **`founder`**: Reference to the founder (required).
### References
- **`founder`**: References the Person model.
### Validation
- **`name`**: Required and should be a string.
- **`contact`**: Required and should be a string.
- **`email`**: Required and should be a string.
- **`licence`**: Optional and should be a string.
## Contributing
Contributions are welcome! Feel free to open issues, submit pull requests, or provide feedback.

## License
This project is licensed under the MIT License.