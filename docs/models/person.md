# Developer Documentation: Person Model
## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Model Overview](#model-overview)
5. [Usage](#usage)
    - [Creating a New Person](#creating-a-new-person)
6. [Schema Details](#schema-details)
    - [Fields](#fields)
    - [Validation](#validation)
9. [Contributing](#contributing)
10. [License](#license)
## Introduction
This document provides developer documentation for the Person model, a MongoDB schema created with Mongoose. The model represents individual persons and includes features such as unique validation for various fields.

## Prerequisites
- Node.js and npm installed
- MongoDB installed and running
- Understanding of TypeScript and Mongoose
## Installation
1. Install the required dependencies:

```bash
npm install mongoose mongoose-unique-validator
```
2. Import the necessary modules in your code:

```typescript
import mongoose from 'mongoose';
import Person, { IPersonModel } from './path-to-person-model';
```
3. Connect to your MongoDB database:

```typescript
mongoose.connect('mongodb://localhost:27017/your-database', { useNewUrlParser: true, useUnifiedTopology: true });
```
## Model Overview
The Person model represents individual persons and includes fields such as name, username, contact, national ID, and email. It also ensures the uniqueness of certain fields using the mongoose-unique-validator plugin.

## Usage
### Creating a New Person
```typescript
const samplePerson: IPersonModel = {
  name: 'John Doe',
  username: 'john_doe',
  contact: '1234567890',
  nationalId: 'ABC123456',
  email: 'john.doe@example.com',
};

const newPerson = new Person(samplePerson);

newPerson.save()
  .then((savedPerson) => {
    console.log('Person saved:', savedPerson);
  })
  .catch((error) => {
    console.error('Error saving person:', error);
  });
```
## Schema Details
### Fields
- **`name`**: Name of the person (required).
- **`username`**: Unique username for the person.
- **`contact`**: Contact number of the person (required).
- **`nationalId`**: National ID of the person.
- **`email`**: Email address of the person.
### Validation
- **`name`**: Required.
- **`username`**: Should be unique.
- **`contact`**: Required and should be unique.
- **`nationalId`**: Should be unique.
- **`email`**: Should be unique.
## Contributing
Contributions are welcome! Feel free to open issues, submit pull requests, or provide feedback.

## License
This project is licensed under the MIT License.

