# Person Schema
## Overview

The Person schema is a MongoDB data model designed for representing individual entities with various attributes. This documentation provides guidance for developers who wish to interact with the Person schema in their applications. The schema includes fields such as name, username, contact information, national ID, and email.
Getting Started
Prerequisites

Ensure that you have the following dependencies installed in your project:

**`mongoose`**: MongoDB object modeling tool for Node.js.
**`mongoose-unique-validator`**: Mongoose plugin for enforcing unique constraints.

Install the dependencies using npm:

```bash
npm install mongoose mongoose-unique-validator
```
## Importing the Person Schema

Import the required modules and the Person schema into your application:

```javascript
import mongoose from "mongoose";
import Person, { IPerson } from "./path-to-person-model";
```
## Using the Person Schema
### Defining a Person Object

To create a new person, define an object conforming to the IPerson interface:

```javascript
const newPerson: IPerson = {
  name: "John Doe",
  username: "john_doe",
  contact: "+1234567890",
  nationalId: "123456789",
  email: "john.doe@example.com",
};
```
### Connecting to MongoDB

Before interacting with the Person schema, establish a connection to your MongoDB database:

```javascript
mongoose.connect("mongodb://localhost:27017/your-database", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

### Creating and Saving a Person

Create a new person using the Person.create method and save it to the database:

```javascript
const savedPerson = await Person.create(newPerson);
```

### Querying for a Person

Retrieve a person from the database using queries. In this example, find a person by their username:

```javascript
const foundPerson = await Person.findOne({ username: "john_doe" });
```

### Updating a Person

Update a person's information by modifying the retrieved object and saving it back to the database:

```javascript
if (foundPerson) {
  foundPerson.name = "Updated Name";
  await foundPerson.save();
}
```

### Closing the Database Connection

Always close the MongoDB connection when you are done:

```javascript
mongoose.connection.close();
```

## Example Usage

Here's an example that combines the steps mentioned above:

```javascript
import mongoose from "mongoose";
import Person, { IPerson } from "./path-to-person-model";

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/your-database", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a new person
const newPerson: IPerson = {
  name: "John Doe",
  username: "john_doe",
  contact: "+1234567890",
  nationalId: "123456789",
  email: "john.doe@example.com",
};

// Save the person to the database
const savedPerson = await Person.create(newPerson);

// Find a person by username
const foundPerson = await Person.findOne({ username: "john_doe" });

// Update a person's information
if (foundPerson) {
  foundPerson.name = "Updated Name";
  await foundPerson.save();
}

// Close the MongoDB connection
mongoose.connection.close();
```