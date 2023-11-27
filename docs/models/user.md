# Developer Documentation: User Model
## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Usage](#usage)
    - [Creating a New User](#creating-a-new-user)
    - [Comparing Passwords](#comparing-passwords)
5. [Middleware](#middleware)
    - [Password Hashing](#password-hashing)
6. [Error Handling](#error-handling)
7. [Contributing](#contributing)
8. [License](#license)
## Introduction
This document provides developer documentation for the User model, which is designed for MongoDB using Mongoose. The model includes features such as password hashing, password comparison, and unique validation.

## Prerequisites
- Node.js and npm installed
- MongoDB installed and running
- Understanding of TypeScript and Mongoose
- Dependancy [IPerson](./person.md)
## Installation
1. Install the required dependencies:

```bash
npm install mongoose bcrypt mongoose-unique-validator
```
2. Import the necessary modules in your code:

```typescript
import mongoose from 'mongoose';
import User, { IUserModel } from './path-to-user-model';
```
3. Connect to your MongoDB database:

```typescript
mongoose.connect('mongodb://localhost:27017/your-database', { useNewUrlParser: true, useUnifiedTopology: true });
```
## Usage
### Creating a New User
```typescript
const samplePersonId = new mongoose.Types.ObjectId();
const sampleUser: IUserModel = {
  person: samplePersonId,
  password: 'securePassword123',
};

const newUser = new User(sampleUser);

newUser.save()
  .then((savedUser) => {
    console.log('User saved:', savedUser);
  })
  .catch((error) => {
    console.error('Error saving user:', error);
  });
```
### Comparing Passwords
```typescript
const userId = '...'; // Replace with the actual user ID

User.findById(userId)
  .then((foundUser) => {
    if (foundUser) {
      foundUser.comparePassword('enteredPassword')
        .then((isMatch) => {
          console.log('Password Match:', isMatch);
        })
        .catch((error) => {
          console.error('Error comparing passwords:', error);
        });
    } else {
      console.log('User not found');
    }
  })
  .catch((error) => {
    console.error('Error finding user:', error);
  });
```
## Middleware
### Password Hashing
The User model includes middleware to hash the password before saving:

```typescript
UserSchema.pre<IUserModel>('save', async function (next) {
  // Hash the password before saving
  // Only hash if the password is modified or it's a new user
  // Uses bcrypt to generate a salt and hash the password
});
```
## Error Handling
Errors during the save or password comparison processes are caught and logged:

```typescript
.catch((error) => {
  console.error('Error saving user:', error);
});

// ...

.catch((error) => {
  console.error('Error comparing passwords:', error);
});
```
## Contributing
Contributions are welcome! Feel free to open issues, submit pull requests, or provide feedback.

## License
This project is licensed under the MIT License.